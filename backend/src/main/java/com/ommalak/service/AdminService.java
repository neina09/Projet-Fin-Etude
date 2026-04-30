package com.ommalak.service;

import com.ommalak.dto.response.StatsResponse;
import com.ommalak.dto.response.UserResponse;
import com.ommalak.dto.response.WorkerResponse;
import com.ommalak.entity.User;
import com.ommalak.entity.WorkerProfile;
import com.ommalak.enums.NotificationType;
import com.ommalak.enums.TaskStatus;
import com.ommalak.enums.UserRole;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final TaskRepository taskRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public StatsResponse getStats() {
        return StatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalWorkers(userRepository.countByRole(UserRole.WORKER))
                .totalTasks(taskRepository.count())
                .totalBookings(bookingRepository.count())
                .pendingWorkers(workerProfileRepository.findByVerifiedFalse().size())
                .openTasks(taskRepository.countByStatus(TaskStatus.OPEN))
                .completedTasks(taskRepository.countByStatus(TaskStatus.COMPLETED))
                .build();
    }

    public List<WorkerResponse> getPendingWorkers() {
        return workerProfileRepository.findByVerifiedFalse()
                .stream().map(WorkerResponse::from).toList();
    }

    @Transactional
    public void approveWorker(Long userId) {
        WorkerProfile wp = workerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Worker profile not found", HttpStatus.NOT_FOUND));
        wp.setVerified(true);
        workerProfileRepository.save(wp);
        notificationService.send(wp.getUser(), NotificationType.APPROVAL,
                "تهانينا! تم قبول طلبك والتحقق من هويتك على منصة عُمَّالَكْ");
    }

    @Transactional
    public void rejectWorker(Long userId, String reason) {
        WorkerProfile wp = workerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Worker profile not found", HttpStatus.NOT_FOUND));
        // Revert to CLIENT role
        User user = wp.getUser();
        user.setRole(UserRole.CLIENT);
        userRepository.save(user);
        workerProfileRepository.delete(wp);
        notificationService.send(user, NotificationType.APPROVAL,
                "تم رفض طلبك: " + (reason != null ? reason : "لم يستوف الشروط المطلوبة"));
    }

    public List<UserResponse> getUsers(String search) {
        List<User> users = (search == null || search.isBlank())
                ? userRepository.findAll()
                : userRepository.findByFullNameContainingIgnoreCaseOrPhoneContaining(search, search);
        return users.stream().map(UserResponse::from).toList();
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        userRepository.delete(user);
    }
}
