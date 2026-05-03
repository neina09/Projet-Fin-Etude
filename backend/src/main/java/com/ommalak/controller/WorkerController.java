package com.ommalak.controller;

import com.ommalak.dto.request.RateRequest;
import com.ommalak.dto.request.WorkerProfileRequest;
import com.ommalak.dto.response.WorkerResponse;
import com.ommalak.entity.User;
import com.ommalak.service.WorkerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public ResponseEntity<List<WorkerResponse>> getAll(
            @RequestParam(required = false) String profession,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(workerService.search(profession, availability, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getById(id));
    }

    @PutMapping("/availability")
    public ResponseEntity<Map<String, String>> updateAvailability(@AuthenticationPrincipal User user,
                                                                   @RequestBody Map<String, String> body) {
        workerService.updateAvailability(user, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Availability updated"));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(@AuthenticationPrincipal User user,
                                                              @RequestBody WorkerProfileRequest req) {
        workerService.updateProfile(user, req);
        return ResponseEntity.ok(Map.of("message", "Profile updated"));
    }

    @PostMapping("/{workerId}/rate")
    public ResponseEntity<Map<String, String>> rate(@PathVariable Long workerId,
                                                    @AuthenticationPrincipal User user,
                                                    @Valid @RequestBody RateRequest req) {
        workerService.rateWorker(workerId, user, req);
        return ResponseEntity.ok(Map.of("message", "Rating submitted"));
    }
}
