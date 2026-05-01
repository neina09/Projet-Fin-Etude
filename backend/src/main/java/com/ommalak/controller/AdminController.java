package com.ommalak.controller;

import com.ommalak.dto.request.PenaltyRequest;
import com.ommalak.dto.response.*;
import com.ommalak.entity.User;
import com.ommalak.service.AdminService;
import com.ommalak.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final TaskService  taskService;

    // ── Stats ─────────────────────────────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ── Workers ───────────────────────────────────────────────────────────────
    @GetMapping("/workers/pending")
    public ResponseEntity<List<WorkerResponse>> getPendingWorkers() {
        return ResponseEntity.ok(adminService.getPendingWorkers());
    }

    @PostMapping("/workers/{id}/approve")
    public ResponseEntity<Map<String, String>> approveWorker(@PathVariable Long id) {
        adminService.approveWorker(id);
        return ResponseEntity.ok(Map.of("message", "Worker approved"));
    }

    @PostMapping("/workers/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectWorker(@PathVariable Long id,
                                                             @RequestBody Map<String, String> body) {
        adminService.rejectWorker(id, body.get("reason"));
        return ResponseEntity.ok(Map.of("message", "Worker rejected"));
    }

    // ── Penalties ─────────────────────────────────────────────────────────────
    @PostMapping("/workers/{id}/penalty")
    public ResponseEntity<Map<String, String>> addPenalty(@PathVariable Long id,
                                                           @AuthenticationPrincipal User admin,
                                                           @RequestBody PenaltyRequest req) {
        adminService.addPenalty(id, admin, req);
        return ResponseEntity.ok(Map.of("message", "Penalty added"));
    }

    @GetMapping("/workers/{id}/penalties")
    public ResponseEntity<List<PenaltyResponse>> getWorkerPenalties(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getWorkerPenalties(id));
    }

    // ── Admin reviews (includes clientPhone) ─────────────────────────────────
    @GetMapping("/workers/{id}/reviews")
    public ResponseEntity<List<AdminReviewResponse>> getWorkerAdminReviews(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getWorkerAdminReviews(id));
    }

    // ── Users ─────────────────────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getUsers(search));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // ── Tasks ─────────────────────────────────────────────────────────────────
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getTasks(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(taskService.getAll(status));
    }

    @GetMapping("/tasks/completed")
    public ResponseEntity<List<TaskResponse>> getCompletedWorkerTasks() {
        return ResponseEntity.ok(adminService.getCompletedWorkerTasks());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id,
                                                           @AuthenticationPrincipal User user) {
        taskService.delete(id, user);
        return ResponseEntity.ok(Map.of("message", "Task deleted"));
    }

    // ── Earnings ──────────────────────────────────────────────────────────────
    @GetMapping("/earnings")
    public ResponseEntity<PlatformEarningsResponse> getEarnings() {
        return ResponseEntity.ok(adminService.getPlatformEarnings());
    }

    @GetMapping("/earnings/history")
    public ResponseEntity<List<EarningsHistoryPoint>> getEarningsHistory(
            @RequestParam(required = false, defaultValue = "30d") String period) {
        return ResponseEntity.ok(adminService.getEarningsHistory(period));
    }
}
