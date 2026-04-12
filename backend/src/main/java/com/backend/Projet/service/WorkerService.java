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
import com.backend.Projet.repository.WorkerRepository;
import com.backend.Projet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;
    private final com.backend.Projet.mapper.WorkerMapper workerMapper;


    @Transactional
    public WorkerResponseDto registerAsWorker(WorkerRequestDto dto, User currentUser) {
        if (workerRepository.findByUserId(currentUser.getId()).isPresent()) {
            throw new BusinessException("You are already registered as a worker");
        }

        currentUser.setRole(Role.WORKER);
        userRepository.save(currentUser);

        Worker worker = Worker.builder()
                .name(dto.getName())
                .phoneNumber(dto.getPhoneNumber())
                .job(dto.getJob())
                .address(dto.getAddress())
                .salary(dto.getSalary())
                .imageUrl(dto.getImageUrl())
                .user(currentUser)
                .availability(WorkerAvailability.AVAILABLE)
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

        user.setRole(Role.WORKER);
        userRepository.save(user);

        Worker worker = Worker.builder()
                .name(dto.getName())
                .phoneNumber(dto.getPhoneNumber())
                .job(dto.getJob())
                .address(dto.getAddress())
                .salary(dto.getSalary())
                .imageUrl(dto.getImageUrl())
                .user(user)
                .availability(WorkerAvailability.AVAILABLE)
                .build();

        return workerMapper.toDto(workerRepository.save(worker));
    }

    public List<WorkerResponseDto> getAllWorkers() {
        return workerRepository.findAll()
                .stream()
                .map(workerMapper::toDto)
                .toList();
    }

    public Page<WorkerResponseDto> getAllWorkersPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return workerRepository.findAll(pageable)
                .map(workerMapper::toDto);
    }

    public WorkerResponseDto getWorkerById(Long id) {
        return workerMapper.toDto(workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found")));
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
        worker.setPhoneNumber(dto.getPhoneNumber());
        worker.setJob(dto.getJob());
        worker.setAddress(dto.getAddress());
        worker.setSalary(dto.getSalary());
        worker.setImageUrl(dto.getImageUrl());
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
                .stream().map(workerMapper::toDto).toList();
    }

    public List<WorkerResponseDto> getWorkersByJob(String job) {
        return workerRepository.findByJob(job)
                .stream().map(workerMapper::toDto).toList();
    }

    public List<WorkerResponseDto> getAvailableWorkers() {
        return workerRepository.findByAvailability(WorkerAvailability.AVAILABLE)
                .stream().map(workerMapper::toDto).toList();
    }
}