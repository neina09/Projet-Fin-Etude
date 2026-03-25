package com.backend.Projet.service;

import com.backend.Projet.dto.WorkerResponseDto;
import com.backend.Projet.exception.ResourceNotFoundException;
import com.backend.Projet.model.Role;
import com.backend.Projet.model.User;
import com.backend.Projet.model.Worker;
import com.backend.Projet.model.WorkerAvailability;
import com.backend.Projet.repository.WorkerRepository;
import com.backend.Projet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;

    private WorkerResponseDto toDto(Worker worker) {
        return WorkerResponseDto.builder()
                .id(worker.getId())
                .name(worker.getName())
                .job(worker.getJob())
                .address(worker.getAddress())
                .salary(worker.getSalary())
                .imageUrl(worker.getImageUrl())
                .phoneNumber(worker.getPhoneNumber())
                .availability(worker.getAvailability())
                .averageRating(worker.getAverageRating())
                .build();
    }

    // أي مستخدم يسجل نفسه كعامل → يتحول دوره إلى WORKER
    public WorkerResponseDto registerAsWorker(Worker workerData, User currentUser) {
        if (workerRepository.findByUserId(currentUser.getId()).isPresent()) {
            throw new RuntimeException("You are already registered as a worker");
        }

        currentUser.setRole(Role.WORKER);
        userRepository.save(currentUser);

        workerData.setUser(currentUser);
        workerData.setAvailability(WorkerAvailability.AVAILABLE);
        return toDto(workerRepository.save(workerData));
    }

    // إنشاء عامل من طرف ADMIN
    public WorkerResponseDto createWorker(Worker worker, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (workerRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("This user is already registered as a worker");
        }

        user.setRole(Role.WORKER);
        userRepository.save(user);

        worker.setUser(user);
        worker.setAvailability(WorkerAvailability.AVAILABLE);
        return toDto(workerRepository.save(worker));
    }

    public List<WorkerResponseDto> getAllWorkers() {
        return workerRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public WorkerResponseDto getWorkerById(Long id) {
        return toDto(workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found")));
    }

    public WorkerResponseDto updateWorker(Long id, Worker updatedWorker, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You are not allowed to update this worker");
        }

        worker.setName(updatedWorker.getName());
        worker.setPhoneNumber(updatedWorker.getPhoneNumber());
        worker.setJob(updatedWorker.getJob());
        worker.setAddress(updatedWorker.getAddress());
        worker.setSalary(updatedWorker.getSalary());
        worker.setImageUrl(updatedWorker.getImageUrl());
        return toDto(workerRepository.save(worker));
    }

    public WorkerResponseDto updateAvailability(Long id, WorkerAvailability availability, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());

        if (!isOwner) {
            throw new RuntimeException("You can only update your own availability");
        }

        worker.setAvailability(availability);
        return toDto(workerRepository.save(worker));
    }

    public void deleteWorker(Long id, User currentUser) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = worker.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You are not allowed to delete this worker");
        }

        // إعادة الدور إلى USER عند الحذف
        User workerUser = worker.getUser();
        workerUser.setRole(Role.USER);
        userRepository.save(workerUser);

        workerRepository.delete(worker);
    }

    public List<WorkerResponseDto> getWorkersByAddress(String address) {
        return workerRepository.findByAddress(address)
                .stream().map(this::toDto).toList();
    }

    public List<WorkerResponseDto> getWorkersByJob(String job) {
        return workerRepository.findByJob(job)
                .stream().map(this::toDto).toList();
    }

    public List<WorkerResponseDto> getAvailableWorkers() {
        return workerRepository.findByAvailability(WorkerAvailability.AVAILABLE)
                .stream().map(this::toDto).toList();
    }
}