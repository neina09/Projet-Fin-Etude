package com.backend.Projet.service;

import com.backend.Projet.dto.*;
import com.backend.Projet.exception.*;
import com.backend.Projet.model.*;
import com.backend.Projet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository   taskRepository;
    private final OfferRepository  offerRepository;
    private final WorkerRepository workerRepository;

    private TaskResponseDto toTaskDto(Task task) {
        return TaskResponseDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .address(task.getAddress())
                .status(task.getStatus())
                .userId(task.getUser().getId())
                .userName(task.getUser().getName())
                .assignedWorkerId(
                        task.getAssignedWorker() != null
                                ? task.getAssignedWorker().getId() : null)
                .assignedWorkerName(
                        task.getAssignedWorker() != null
                                ? task.getAssignedWorker().getName() : null)
                .createdAt(task.getCreatedAt())
                .build();
    }

    private OfferResponseDto toOfferDto(Offer offer) {
        return OfferResponseDto.builder()
                .id(offer.getId())
                .taskId(offer.getTask().getId())
                .taskTitle(offer.getTask().getTitle())
                .workerId(offer.getWorker().getId())
                .workerName(offer.getWorker().getName())
                .workerJob(offer.getWorker().getJob())
                .message(offer.getMessage())
                .price(offer.getPrice())
                .status(offer.getStatus())
                .createdAt(offer.getCreatedAt())
                .build();
    }

    public TaskResponseDto createTask(TaskRequestDto input, User user) {
        Task task = Task.builder()
                .title(input.getTitle())
                .description(input.getDescription())
                .address(input.getAddress())
                .status(TaskStatus.OPEN)
                .user(user)
                .build();
        return toTaskDto(taskRepository.save(task));
    }

    // مرئية للجميع بدون login
    public PageResponseDto<TaskResponseDto> getOpenTasks(Pageable pageable) {
        return PageResponseDto.from(
                taskRepository.findByStatus(TaskStatus.OPEN, pageable)
                        .map(this::toTaskDto)
        );
    }

    // بحث في Tasks المفتوحة
    public PageResponseDto<TaskResponseDto> searchOpenTasks(
            String keyword, String address, Pageable pageable) {
        return PageResponseDto.from(
                taskRepository.searchOpenTasks(
                                TaskStatus.OPEN, address, keyword, pageable)
                        .map(this::toTaskDto)
        );
    }

    public PageResponseDto<TaskResponseDto> getMyTasks(
            User user, Pageable pageable) {
        return PageResponseDto.from(
                taskRepository.findByUserId(user.getId(), pageable)
                        .map(this::toTaskDto)
        );
    }
    public TaskResponseDto getTaskById(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUser().getId().equals(user.getId()))
            throw new UnauthorizedException("Not authorized");
        return toTaskDto(task);
    }

    public TaskResponseDto updateTask(
            Long id, TaskRequestDto input, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUser().getId().equals(user.getId()))
            throw new UnauthorizedException("Not authorized");
        if (task.getStatus() == TaskStatus.CLOSED
                || task.getStatus() == TaskStatus.CANCELLED)
            throw new BusinessException("Cannot update a closed or cancelled task");

        task.setTitle(input.getTitle());
        task.setDescription(input.getDescription());
        task.setAddress(input.getAddress());
        return toTaskDto(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUser().getId().equals(user.getId()))
            throw new UnauthorizedException("Not authorized");
        if (task.getStatus() == TaskStatus.IN_PROGRESS)
            throw new BusinessException("Cannot delete a task in progress");

        offerRepository.findByTaskId(id)
                .forEach(o -> {
                    o.setStatus(OfferStatus.CLOSED);
                    offerRepository.save(o);
                });
        taskRepository.delete(task);
    }

    // المستخدم يرى العروض على task معينة
    public List<OfferResponseDto> getOffersForTask(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUser().getId().equals(user.getId()))
            throw new UnauthorizedException("Not your task");
        return offerRepository.findByTaskId(taskId)
                .stream().map(this::toOfferDto).toList();
    }

    // المستخدم يختار عرض → SELECTED
    @Transactional
    public OfferResponseDto selectOffer(Long offerId, User user) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));
        Task task = offer.getTask();

        if (!task.getUser().getId().equals(user.getId()))
            throw new UnauthorizedException("Not your task");
        if (task.getStatus() != TaskStatus.OPEN)
            throw new BusinessException("Task is not open");
        if (offer.getStatus() != OfferStatus.PENDING)
            throw new BusinessException("Offer is not pending");

        // العرض المختار → SELECTED
        offer.setStatus(OfferStatus.SELECTED);
        offerRepository.save(offer);

        // باقي العروض → REFUSED
        offerRepository.findByTaskId(task.getId()).stream()
                .filter(o -> !o.getId().equals(offerId))
                .filter(o -> o.getStatus() == OfferStatus.PENDING)
                .forEach(o -> {
                    o.setStatus(OfferStatus.REFUSED);
                    offerRepository.save(o);
                });

        return toOfferDto(offer);
    }

    // المستخدم يؤكد الإنجاز → COMPLETED
    @Transactional
    public TaskResponseDto markDone(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUser().getId().equals(user.getId()))
            throw new UnauthorizedException("Not your task");
        if (task.getStatus() != TaskStatus.IN_PROGRESS)
            throw new BusinessException("Task is not in progress");

        offerRepository.findByTaskId(taskId).stream()
                .filter(o -> o.getStatus() == OfferStatus.IN_PROGRESS)
                .findFirst()
                .ifPresent(o -> {
                    o.setStatus(OfferStatus.COMPLETED);
                    offerRepository.save(o);
                });

        task.setStatus(TaskStatus.COMPLETED);
        return toTaskDto(taskRepository.save(task));
    }

    // المستخدم يلغي Task
    @Transactional
    public TaskResponseDto cancelTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getUser().getId().equals(user.getId()))
            throw new UnauthorizedException("Not authorized");
        if (task.getStatus() == TaskStatus.CLOSED
                || task.getStatus() == TaskStatus.CANCELLED)
            throw new BusinessException("Task is already closed or cancelled");
        if (task.getStatus() == TaskStatus.IN_PROGRESS)
            throw new BusinessException("Cannot cancel a task in progress");

        // كل العروض المعلقة → CLOSED
        offerRepository.findByTaskId(id).stream()
                .filter(o -> o.getStatus() == OfferStatus.PENDING
                        || o.getStatus() == OfferStatus.SELECTED)
                .forEach(o -> {
                    o.setStatus(OfferStatus.CLOSED);
                    offerRepository.save(o);
                });

        task.setStatus(TaskStatus.CANCELLED);
        return toTaskDto(taskRepository.save(task));
    }

    // العامل يقدم عرض
    public OfferResponseDto submitOffer(
            Long taskId, OfferRequestDto dto, User workerUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getStatus() != TaskStatus.OPEN)
            throw new BusinessException("Task is not open");
        if (task.getUser().getId().equals(workerUser.getId()))
            throw new BusinessException("Cannot offer on your own task");

        Worker worker = workerRepository.findByUserId(workerUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Worker profile not found — register as worker first"));

        if (offerRepository.existsByTaskIdAndWorkerId(taskId, worker.getId()))
            throw new BusinessException("You already submitted an offer on this task");

        Offer offer = Offer.builder()
                .task(task)
                .worker(worker)
                .message(dto.getMessage())
                .price(dto.getPrice())
                .build();

        return toOfferDto(offerRepository.save(offer));
    }

    // العامل يرى عروضه
    public List<OfferResponseDto> getMyOffers(User workerUser) {
        return offerRepository.findByWorkerUserId(workerUser.getId())
                .stream().map(this::toOfferDto).toList();
    }

    // العامل يقبل بعد أن اختاره المستخدم → IN_PROGRESS
    @Transactional
    public OfferResponseDto workerAccept(Long offerId, User workerUser) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));

        if (!offer.getWorker().getUser().getId().equals(workerUser.getId()))
            throw new UnauthorizedException("Not your offer");
        if (offer.getStatus() != OfferStatus.SELECTED)
            throw new BusinessException("You were not selected yet");

        offer.setStatus(OfferStatus.IN_PROGRESS);
        offerRepository.save(offer);

        Task task = offer.getTask();
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setAssignedWorker(offer.getWorker());
        taskRepository.save(task);

        return toOfferDto(offer);
    }

    // العامل يرفض بعد أن اختاره المستخدم → Task يرجع OPEN
    @Transactional
    public OfferResponseDto workerRefuse(Long offerId, User workerUser) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));

        if (!offer.getWorker().getUser().getId().equals(workerUser.getId()))
            throw new UnauthorizedException("Not your offer");
        if (offer.getStatus() != OfferStatus.SELECTED)
            throw new BusinessException("You were not selected yet");

        offer.setStatus(OfferStatus.WORKER_REFUSED);
        offerRepository.save(offer);

        // Task يرجع OPEN
        Task task = offer.getTask();
        task.setStatus(TaskStatus.OPEN);
        task.setAssignedWorker(null);
        taskRepository.save(task);

        // العروض المرفوضة ترجع PENDING
        offerRepository.findByTaskId(task.getId()).stream()
                .filter(o -> o.getStatus() == OfferStatus.REFUSED)
                .forEach(o -> {
                    o.setStatus(OfferStatus.PENDING);
                    offerRepository.save(o);
                });

        return toOfferDto(offer);
    }
}