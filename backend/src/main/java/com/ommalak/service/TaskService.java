package com.ommalak.service;

import com.ommalak.dto.request.OfferRequest;
import com.ommalak.dto.request.TaskRequest;
import com.ommalak.dto.response.OfferResponse;
import com.ommalak.dto.response.TaskResponse;
import com.ommalak.entity.Offer;
import com.ommalak.entity.Task;
import com.ommalak.entity.User;
import com.ommalak.enums.NotificationType;
import com.ommalak.enums.TaskStatus;
import com.ommalak.enums.UserRole;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.OfferRepository;
import com.ommalak.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final OfferRepository offerRepository;
    private final NotificationService notificationService;

    public List<TaskResponse> getAll(String status) {
        List<Task> tasks = (status != null && !status.isBlank())
                ? taskRepository.findByStatusOrderByCreatedAtDesc(TaskStatus.valueOf(status))
                : taskRepository.findAllByOrderByCreatedAtDesc();
        return tasks.stream().map(t -> TaskResponse.from(t, offerRepository.findByTask(t).size())).toList();
    }

    public TaskResponse getById(Long id) {
        Task task = find(id);
        return TaskResponse.from(task, offerRepository.findByTask(task).size());
    }

    public List<TaskResponse> getMyTasks(User user) {
        return taskRepository.findByClient(user)
                .stream().map(t -> TaskResponse.from(t, offerRepository.findByTask(t).size())).toList();
    }

    @Transactional
    public TaskResponse create(User client, TaskRequest req) {
        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .profession(req.getProfession())
                .city(req.getCity())
                .budget(req.getBudget())
                .client(client)
                .status(TaskStatus.PENDING)
                .build();
        return TaskResponse.from(taskRepository.save(task), 0);
    }

    @Transactional
    public TaskResponse update(Long id, User user, TaskRequest req) {
        Task task = find(id);
        assertOwnerOrAdmin(task, user);
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setProfession(req.getProfession());
        task.setCity(req.getCity());
        task.setBudget(req.getBudget());
        return TaskResponse.from(taskRepository.save(task), offerRepository.findByTask(task).size());
    }

    @Transactional
    public void delete(Long id, User user) {
        Task task = find(id);
        assertOwnerOrAdmin(task, user);
        taskRepository.delete(task);
    }

    @Transactional
    public OfferResponse submitOffer(Long taskId, User worker, OfferRequest req) {
        Task task = find(taskId);
        if (task.getStatus() != TaskStatus.OPEN) throw new ApiException("Task is not open for offers");
        if (offerRepository.existsByTaskAndWorker(task, worker)) throw new ApiException("You already submitted an offer");

        Offer offer = Offer.builder()
                .task(task).worker(worker)
                .message(req.getMessage()).price(req.getPrice())
                .build();
        offerRepository.save(offer);

        notificationService.send(task.getClient(), NotificationType.OFFER,
                "عرض جديد على مهمتك: " + task.getTitle());
        return OfferResponse.from(offer);
    }

    public List<OfferResponse> getOffers(Long taskId, User user) {
        Task task = find(taskId);
        assertOwnerOrAdmin(task, user);
        return offerRepository.findByTask(task).stream().map(OfferResponse::from).toList();
    }

    @Transactional
    public void acceptOffer(Long taskId, Long offerId, User user) {
        Task task = find(taskId);
        assertOwnerOrAdmin(task, user);
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ApiException("Offer not found", HttpStatus.NOT_FOUND));
        task.setAssignedWorker(offer.getWorker());
        task.setStatus(TaskStatus.IN_PROGRESS);
        taskRepository.save(task);

        notificationService.send(offer.getWorker(), NotificationType.BOOKING,
                "تم قبول عرضك على المهمة: " + task.getTitle());
    }

    @Transactional
    public void updateStatus(Long id, User user, String status) {
        Task task = find(id);
        assertOwnerOrAdmin(task, user);
        task.setStatus(TaskStatus.valueOf(status));
        taskRepository.save(task);
    }

    private Task find(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ApiException("Task not found", HttpStatus.NOT_FOUND));
    }

    private void assertOwnerOrAdmin(Task task, User user) {
        boolean isOwner = task.getClient().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        if (!isOwner && !isAdmin) throw new ApiException("Forbidden", HttpStatus.FORBIDDEN);
    }
}
