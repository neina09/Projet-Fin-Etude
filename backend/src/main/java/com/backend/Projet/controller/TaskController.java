package com.backend.Projet.controller;

import com.backend.Projet.dto.*;
import com.backend.Projet.model.User;
import com.backend.Projet.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // ── Public — بدون login ──

    @GetMapping("/open")
    public ResponseEntity<PageResponseDto<TaskResponseDto>> getOpenTasks(
            @PageableDefault(size = 10, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(taskService.getOpenTasks(pageable));
    }

    @GetMapping("/open/search")
    public ResponseEntity<PageResponseDto<TaskResponseDto>> searchOpenTasks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String address,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(
                taskService.searchOpenTasks(keyword, address, pageable));
    }

    // FIX #1: getTaskById لا يحتاج User — يراه الجميع
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(
            @PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // ── USER actions ──

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(
            @Valid @RequestBody TaskRequestDto input,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.createTask(input, currentUser));
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<PageResponseDto<TaskResponseDto>> getMyTasks(
            @PageableDefault(size = 10, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.getMyTasks(currentUser, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDto input,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.updateTask(id, input, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @GetMapping("/{id}/offers")
    public ResponseEntity<List<OfferResponseDto>> getOffersForTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.getOffersForTask(id, currentUser));
    }

    @PatchMapping("/offers/{offerId}/select")
    public ResponseEntity<OfferResponseDto> selectOffer(
            @PathVariable Long offerId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.selectOffer(offerId, currentUser));
    }

    @PatchMapping("/{id}/done")
    public ResponseEntity<TaskResponseDto> markDone(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.markDone(id, currentUser));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<TaskResponseDto> cancelTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.cancelTask(id, currentUser));
    }

    // ── WORKER actions ──

    @PostMapping("/{id}/offer")
    public ResponseEntity<OfferResponseDto> submitOffer(
            @PathVariable Long id,
            @Valid @RequestBody OfferRequestDto dto,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.submitOffer(id, dto, currentUser));
    }

    @GetMapping("/my-offers")
    public ResponseEntity<List<OfferResponseDto>> getMyOffers(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.getMyOffers(currentUser));
    }

    @PatchMapping("/offers/{offerId}/worker-accept")
    public ResponseEntity<OfferResponseDto> workerAccept(
            @PathVariable Long offerId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.workerAccept(offerId, currentUser));
    }

    @PatchMapping("/offers/{offerId}/worker-refuse")
    public ResponseEntity<OfferResponseDto> workerRefuse(
            @PathVariable Long offerId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                taskService.workerRefuse(offerId, currentUser));
    }
}