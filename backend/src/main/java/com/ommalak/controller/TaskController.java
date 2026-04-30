package com.ommalak.controller;

import com.ommalak.dto.request.OfferRequest;
import com.ommalak.dto.request.TaskRequest;
import com.ommalak.dto.response.OfferResponse;
import com.ommalak.dto.response.TaskResponse;
import com.ommalak.entity.User;
import com.ommalak.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(taskService.getAll(status));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TaskResponse>> getMyTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getMyTasks(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@AuthenticationPrincipal User user,
                                               @Valid @RequestBody TaskRequest req) {
        return ResponseEntity.ok(taskService.create(user, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id,
                                               @AuthenticationPrincipal User user,
                                               @Valid @RequestBody TaskRequest req) {
        return ResponseEntity.ok(taskService.update(id, user, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id,
                                                       @AuthenticationPrincipal User user) {
        taskService.delete(id, user);
        return ResponseEntity.ok(Map.of("message", "Task deleted"));
    }

    @PostMapping("/{taskId}/offers")
    public ResponseEntity<OfferResponse> submitOffer(@PathVariable Long taskId,
                                                     @AuthenticationPrincipal User user,
                                                     @RequestBody OfferRequest req) {
        return ResponseEntity.ok(taskService.submitOffer(taskId, user, req));
    }

    @GetMapping("/{taskId}/offers")
    public ResponseEntity<List<OfferResponse>> getOffers(@PathVariable Long taskId,
                                                         @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getOffers(taskId, user));
    }

    @PostMapping("/{taskId}/offers/{offerId}/accept")
    public ResponseEntity<Map<String, String>> acceptOffer(@PathVariable Long taskId,
                                                           @PathVariable Long offerId,
                                                           @AuthenticationPrincipal User user) {
        taskService.acceptOffer(taskId, offerId, user);
        return ResponseEntity.ok(Map.of("message", "Offer accepted"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id,
                                                            @AuthenticationPrincipal User user,
                                                            @RequestBody Map<String, String> body) {
        taskService.updateStatus(id, user, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}
