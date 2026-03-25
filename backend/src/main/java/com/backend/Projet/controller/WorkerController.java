package com.backend.Projet.controller;

import com.backend.Projet.dto.WorkerResponseDto;
import com.backend.Projet.model.User;
import com.backend.Projet.model.Worker;
import com.backend.Projet.model.WorkerAvailability;
import com.backend.Projet.service.JwtService;
import com.backend.Projet.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin("*")
public class WorkerController {

    private final WorkerService workerService;
    private final JwtService jwtService; // ← أضفنا هذا

    // أي مستخدم مسجل يسجل نفسه كعامل
    // بعد التسجيل نرجع token جديد يحتوي Role.WORKER
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerAsWorker(@RequestBody Worker workerData) {
        User currentUser = getCurrentUser();
        WorkerResponseDto worker = workerService.registerAsWorker(workerData, currentUser);

        // ← Token جديد بعد تغيير الدور
        String newToken = jwtService.generateToken(currentUser);

        Map<String, Object> response = new HashMap<>();
        response.put("worker", worker);
        response.put("token", newToken);
        response.put("expiresIn", jwtService.getExpirationTime());

        return ResponseEntity.ok(response);
    }

    // Admin فقط
    @PostMapping("/admin/create/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkerResponseDto> createWorker(
            @RequestBody Worker worker,
            @PathVariable Long userId) {
        return ResponseEntity.ok(workerService.createWorker(worker, userId));
    }

    @GetMapping
    public ResponseEntity<List<WorkerResponseDto>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/available")
    public ResponseEntity<List<WorkerResponseDto>> getAvailableWorkers() {
        return ResponseEntity.ok(workerService.getAvailableWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponseDto> getWorkerById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorkerById(id));
    }

    // ← حذفنا @PreAuthorize لأن الـ Service يتحقق من isOwner/isAdmin
    @PutMapping("/{id}")
    public ResponseEntity<WorkerResponseDto> updateWorker(
            @PathVariable Long id,
            @RequestBody Worker worker) {
        return ResponseEntity.ok(workerService.updateWorker(id, worker, getCurrentUser()));
    }

    // ← حذفنا @PreAuthorize
    @PatchMapping("/{id}/availability")
    public ResponseEntity<WorkerResponseDto> updateAvailability(
            @PathVariable Long id,
            @RequestParam WorkerAvailability availability) {
        return ResponseEntity.ok(workerService.updateAvailability(id, availability, getCurrentUser()));
    }

    // ← حذفنا @PreAuthorize
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id, getCurrentUser());
        return ResponseEntity.ok("Worker deleted successfully");
    }

    @GetMapping("/job/{job}")
    public ResponseEntity<List<WorkerResponseDto>> getWorkersByJob(@PathVariable String job) {
        return ResponseEntity.ok(workerService.getWorkersByJob(job));
    }

    @GetMapping("/address/{address}")
    public ResponseEntity<List<WorkerResponseDto>> getWorkersByAddress(@PathVariable String address) {
        return ResponseEntity.ok(workerService.getWorkersByAddress(address));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}