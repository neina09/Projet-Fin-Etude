package com.ommalak.service;

import com.ommalak.dto.request.PenaltyRequest;
import com.ommalak.dto.response.*;
import com.ommalak.entity.*;
import com.ommalak.enums.*;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository              userRepository;
    private final WorkerProfileRepository     workerProfileRepository;
    private final TaskRepository              taskRepository;
    private final BookingRepository           bookingRepository;
    private final WorkerPenaltyRepository     penaltyRepository;
    private final ReviewRepository            reviewRepository;
    private final OfferRepository             offerRepository;
    private final NotificationService         notificationService;

    // ── Stats ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
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

    // ── Worker approval ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
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
        User user = wp.getUser();
        user.setRole(UserRole.CLIENT);
        userRepository.save(user);
        workerProfileRepository.delete(wp);
        notificationService.send(user, NotificationType.APPROVAL,
                "تم رفض طلبك: " + (reason != null ? reason : "لم يستوف الشروط المطلوبة"));
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
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

    // ── Earnings ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PlatformEarningsResponse getPlatformEarnings() {
        List<WorkerProfile> allWorkers = workerProfileRepository.findAll();
        List<WorkerEarningsResponse> perWorker = new ArrayList<>();

        double totalRevenue = 0;

        for (WorkerProfile wp : allWorkers) {
            List<Booking> completed = bookingRepository.findCompletedByWorker(wp.getUser());
            if (completed.isEmpty()) continue;

            double workerTotal = completed.stream()
                    .mapToDouble(b -> b.getPrice() != null ? b.getPrice() : 0.0)
                    .sum();

            totalRevenue += workerTotal;
            perWorker.add(WorkerEarningsResponse.builder()
                    .workerId(wp.getUser().getId())
                    .workerName(wp.getUser().getFullName())
                    .profession(wp.getProfession())
                    .profilePictureUrl(wp.getProfilePictureUrl())
                    .completedBookings(completed.size())
                    .totalRevenue(round(workerTotal))
                    .workerEarnings(round(workerTotal * 0.9))
                    .platformFee(round(workerTotal * 0.1))
                    .build());
        }

        perWorker.sort(Comparator.comparingDouble(WorkerEarningsResponse::getTotalRevenue).reversed());

        return PlatformEarningsResponse.builder()
                .totalRevenue(round(totalRevenue))
                .totalWorkerEarnings(round(totalRevenue * 0.9))
                .totalPlatformFee(round(totalRevenue * 0.1))
                .totalCompletedBookings((int) bookingRepository.findByStatus(BookingStatus.COMPLETED).stream()
                        .filter(b -> b.getPrice() != null).count())
                .perWorker(perWorker)
                .build();
    }

    @Transactional(readOnly = true)
    public List<EarningsHistoryPoint> getEarningsHistory(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from;
        boolean groupByWeek;

        switch (period == null ? "30d" : period) {
            case "7d"  -> { from = now.minusDays(7);   groupByWeek = false; }
            case "90d" -> { from = now.minusDays(90);  groupByWeek = true;  }
            case "1y"  -> { from = now.minusDays(365); groupByWeek = true;  }
            default    -> { from = now.minusDays(30);  groupByWeek = false; }
        }

        List<Booking> bookings = bookingRepository.findCompletedInRange(from, now);
        DateTimeFormatter dayFmt  = DateTimeFormatter.ofPattern("dd MMM");
        DateTimeFormatter weekFmt = DateTimeFormatter.ofPattern("'S'ww yyyy");

        Map<String, Double> grouped = new LinkedHashMap<>();
        for (Booking b : bookings) {
            String label = groupByWeek
                    ? b.getCreatedAt().format(weekFmt)
                    : b.getCreatedAt().format(dayFmt);
            grouped.merge(label, b.getPrice() != null ? b.getPrice() : 0.0, Double::sum);
        }

        return grouped.entrySet().stream().map(e -> EarningsHistoryPoint.builder()
                .label(e.getKey())
                .revenue(round(e.getValue()))
                .workerEarnings(round(e.getValue() * 0.9))
                .platformFee(round(e.getValue() * 0.1))
                .build()).collect(Collectors.toList());
    }

    // ── Penalties ─────────────────────────────────────────────────────────────

    @Transactional
    public void addPenalty(Long workerId, User admin, PenaltyRequest req) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ApiException("Worker not found", HttpStatus.NOT_FOUND));
        penaltyRepository.save(WorkerPenalty.builder()
                .worker(worker).admin(admin)
                .reason(req.getReason()).amount(req.getAmount())
                .build());
        notificationService.send(worker, NotificationType.SYSTEM,
                "تم تطبيق غرامة على حسابك بقيمة " + req.getAmount() + " MRU — السبب: " + req.getReason());
    }

    @Transactional(readOnly = true)
    public List<PenaltyResponse> getWorkerPenalties(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ApiException("Worker not found", HttpStatus.NOT_FOUND));
        return penaltyRepository.findByWorkerOrderByCreatedAtDesc(worker)
                .stream().map(PenaltyResponse::from).toList();
    }

    // ── Admin reviews (with client phone) ────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AdminReviewResponse> getWorkerAdminReviews(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ApiException("Worker not found", HttpStatus.NOT_FOUND));
        return reviewRepository.findByWorker(worker)
                .stream().map(AdminReviewResponse::from).toList();
    }

    // ── Completed worker tasks ────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TaskResponse> getCompletedWorkerTasks() {
        return taskRepository.findByStatusAndAssignedWorkerIsNotNull(TaskStatus.COMPLETED)
                .stream().map(t -> TaskResponse.from(t, offerRepository.findByTask(t).size()))
                .toList();
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
