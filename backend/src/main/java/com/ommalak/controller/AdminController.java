package com.ommalak.controller;

import com.ommalak.dto.response.StatsResponse;
import com.ommalak.dto.response.TaskResponse;
import com.ommalak.dto.response.UserResponse;
import com.ommalak.dto.response.WorkerResponse;
import com.ommalak.service.AdminService;
import com.ommalak.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final TaskService taskService;

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

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

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getUsers(search));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getTasks(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(taskService.getAll(status));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id,
                                                          @org.springframework.security.core.annotation.AuthenticationPrincipal com.ommalak.entity.User user) {
        taskService.delete(id, user);
        return ResponseEntity.ok(Map.of("message", "Task deleted"));
    }
}
