package com.backend.Projet.service;

import com.backend.Projet.dto.WorkerRequestDto;
import com.backend.Projet.dto.WorkerResponseDto;
import com.backend.Projet.exception.BusinessException;
import com.backend.Projet.exception.ResourceNotFoundException;
import com.backend.Projet.exception.UnauthorizedException;
import com.backend.Projet.model.Role;
import com.backend.Projet.model.User;
import com.backend.Projet.model.Worker;
import com.backend.Projet.model.WorkerAvailability;
import com.backend.Projet.model.WorkerVerificationStatus;
import com.backend.Projet.repository.WorkerRepository;
import com.backend.Projet.repository.UserRepository;
import com.backend.Projet.util.MauritaniaPhoneUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;
    private final com.backend.Projet.mapper.WorkerMapper workerMapper;
    private final FileStorageService fileStorageService;


    @Transactional
    public WorkerResponseDto registerAsWorker(WorkerRequestDto dto, User currentUser) {
        if (workerRepository.findByUserId(currentUser.getId()).isPresent()) {
            throw new BusinessException("You are already registered as a worker");
        }
        String normalizedPhone = MauritaniaPhoneUtils.normalize(dto.getPhoneNumber());
        validateWorkerIdentity(dto.getNationalIdNumber(), normalizedPhone, null);

        currentUser.setRole(Role.WORKER);
        userRepository.save(currentUser);

        Worker worker = Worker.builder()
                .name(dto.getName())
                .phoneNumber(normalizedPhone)
                .job(dto.getJob())
                .address(dto.getAddress())
                .salary(dto.getSalary())
                .imageUrl(dto.getImageUrl())
                .nationalIdNumber(dto.getNationalIdNumber().trim())
                .user(currentUser)
                .availability(WorkerAvailability.AVAILABLE)
                .verificationStatus(WorkerVerificationStatus.PENDING)
                .verificationNotes("Pending admin review")
                .build();

        return workerMapper.toDto(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponseDto createWorker(WorkerRequestDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (workerRepository.findByUserId(userId).isPresent()) {
            throw new BusinessException("User is already registered as a worker");
        }
        String normalizedPhone = MauritaniaPhoneUtils.normalize(dto.getPhoneNumber());
        validateWorkerIdentity(dto.getNationalIdNumber(), normalizedPhone, null);

        user.setRole(Role.WORKER);
        userRepository.save(user);

        Worker worker = Worker.builder()
                .name(dto.getName())
                .phoneNumber(normalizedPhone)
                .job(dto.getJob())
                .address(dto.getAddress())
                .salary(dto.getSalary())
                .imageUrl(dto.getImageUrl())
                .nationalIdNumber(dto.getNationalIdNumber().trim())
                .user(user)
                .availability(WorkerAvailability.AVAILABLE)
                .verificationStatus(WorkerVerificationStatus.VERIFIED)
                .verificationNotes("Verified by admin")
                .build();

        return workerMapper.toDto(workerRepository.save(worker));
    }

    public List<WorkerResponseDto> getAllWorkers() {
        return workerRepository.findByVerificationStatus(WorkerVerificationStatus.VERIFIED)
                .stream()
                .map(workerMapper::toDto)
                .toList();
    }

    public Page<WorkerResponseDto> getAllWorkersPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return workerRepository.findByVerificationStatus(WorkerVerificationStatus.VERIFIED, pageable)
                .map(workerMapper::toDto);
    }

    public WorkerResponseDto getWorkerById(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        if (worker.getVerificationStatus() != WorkerVerificationStatus.VERIFIED) {
            throw new ResourceNotFoundException("Worker not found");
        }
        return workerMapper.toDto(worker);
    }

    public WorkerResponseDto getWorkerForOwnerOrAdmin(Long id, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("Not authorized");
        }
        return workerMapper.toDto(worker);
    }

    public WorkerResponseDto getMyWorkerProfile(User currentUser) {
        Worker worker = workerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for this user"));
        return workerMapper.toDto(worker);
    }

    @Transactional
    public WorkerResponseDto updateWorker(Long id, WorkerRequestDto dto, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You are not allowed to update this worker");
        }

        worker.setName(dto.getName());
        String normalizedPhone = MauritaniaPhoneUtils.normalize(dto.getPhoneNumber());
        validateWorkerIdentity(dto.getNationalIdNumber(), normalizedPhone, worker.getId());
        worker.setPhoneNumber(normalizedPhone);
        worker.setJob(dto.getJob());
        worker.setAddress(dto.getAddress());
        worker.setSalary(dto.getSalary());
        worker.setImageUrl(dto.getImageUrl());
        worker.setNationalIdNumber(dto.getNationalIdNumber().trim());
        if (!isAdmin) {
            worker.setVerificationStatus(WorkerVerificationStatus.PENDING);
            worker.setVerificationNotes("Profile updated and waiting for admin review");
        }
        return workerMapper.toDto(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponseDto updateAvailability(Long id, WorkerAvailability availability, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());

        if (!isOwner) {
            throw new UnauthorizedException("You can only update your own availability");
        }
        if (worker.getVerificationStatus() != WorkerVerificationStatus.VERIFIED) {
            throw new BusinessException("Only verified workers can update availability");
        }

        worker.setAvailability(availability);
        return workerMapper.toDto(workerRepository.save(worker));
    }

    @Transactional
    public void deleteWorker(Long id, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You are not allowed to delete this worker");
        }

        User workerUser = worker.getUser();
        workerUser.setRole(Role.USER);
        userRepository.save(workerUser);

        workerRepository.delete(worker);
    }

    public List<WorkerResponseDto> getWorkersByAddress(String address) {
        return workerRepository.findByAddress(address)
                .stream()
                .filter(worker -> worker.getVerificationStatus() == WorkerVerificationStatus.VERIFIED)
                .map(workerMapper::toDto)
                .toList();
    }

    public List<WorkerResponseDto> getWorkersByJob(String job) {
        return workerRepository.findByJob(job)
                .stream()
                .filter(worker -> worker.getVerificationStatus() == WorkerVerificationStatus.VERIFIED)
                .map(workerMapper::toDto)
                .toList();
    }

    public List<WorkerResponseDto> getAvailableWorkers() {
        return workerRepository.findByAvailabilityAndVerificationStatus(
                        WorkerAvailability.AVAILABLE,
                        WorkerVerificationStatus.VERIFIED)
                .stream().map(workerMapper::toDto).toList();
    }

    public List<WorkerResponseDto> getWorkersPendingVerification() {
        return workerRepository.findByVerificationStatus(WorkerVerificationStatus.PENDING)
                .stream().map(workerMapper::toDto).toList();
    }

    @Transactional
    public WorkerResponseDto uploadWorkerImage(Long id, MultipartFile file, User currentUser) {
        Worker worker = getOwnedOrManagedWorker(id, currentUser);
        worker.setImageUrl(fileStorageService.storeWorkerImage(file));
        if (worker.getVerificationStatus() != WorkerVerificationStatus.VERIFIED) {
            worker.setVerificationStatus(WorkerVerificationStatus.PENDING);
            worker.setVerificationNotes("Profile image uploaded and waiting for admin review");
        }
        return workerMapper.toDto(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponseDto uploadIdentityDocument(Long id, MultipartFile file, User currentUser) {
        Worker worker = getOwnedOrManagedWorker(id, currentUser);
        worker.setIdentityDocumentUrl(fileStorageService.storeWorkerDocument(file));
        worker.setVerificationStatus(WorkerVerificationStatus.PENDING);
        worker.setVerificationNotes("Identity document uploaded and waiting for admin review");
        return workerMapper.toDto(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponseDto verifyWorker(Long id, User currentUser, String notes) {
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can verify workers");
        }
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        worker.setVerificationStatus(WorkerVerificationStatus.VERIFIED);
        worker.setVerificationNotes(notes == null || notes.isBlank() ? "Verified by admin" : notes.trim());
        worker.setAvailability(WorkerAvailability.AVAILABLE);
        return workerMapper.toDto(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponseDto rejectWorker(Long id, User currentUser, String notes) {
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can reject workers");
        }
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        worker.setVerificationStatus(WorkerVerificationStatus.REJECTED);
        worker.setVerificationNotes(notes == null || notes.isBlank() ? "Rejected by admin" : notes.trim());
        return workerMapper.toDto(workerRepository.save(worker));
    }

    private void validateWorkerIdentity(String nationalIdNumber, String phoneNumber, Long currentWorkerId) {
        workerRepository.findByPhoneNumber(phoneNumber)
                .filter(worker -> currentWorkerId == null || !worker.getId().equals(currentWorkerId))
                .ifPresent(worker -> {
                    throw new BusinessException("Phone number is already used by another worker");
                });

        workerRepository.findByNationalIdNumber(nationalIdNumber.trim())
                .filter(worker -> currentWorkerId == null || !worker.getId().equals(currentWorkerId))
                .ifPresent(worker -> {
                    throw new BusinessException("National ID number is already used by another worker");
                });
    }

    private Worker getOwnedOrManagedWorker(Long id, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("Not authorized");
        }
        return worker;
    }
}
