package com.backend.Projet.controller;

import com.backend.Projet.model.Worker;
import com.backend.Projet.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin("*")
public class WorkerController {

    private final WorkerService workerService;

    // إنشاء عامل
    @PostMapping
    public Worker createWorker(@RequestBody Worker worker) {
        return workerService.createWorker(worker);
    }

    // الحصول على كل العمال
    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerService.getAllWorkers();
    }

    // الحصول على عامل واحد
    @GetMapping("/{id}")
    public Worker getWorkerById(@PathVariable Long id) {
        return workerService.getWorkerById(id);
    }

    // تعديل عامل
    @PutMapping("/{id}")
    public Worker updateWorker(@PathVariable Long id, @RequestBody Worker worker) {
        return workerService.updateWorker(id, worker);
    }

    // حذف عامل
    @DeleteMapping("/{id}")
    public String deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return "Worker deleted successfully";
    }

    // البحث بالمهنة
    @GetMapping("/job/{job}")
    public List<Worker> getWorkersByJob(@PathVariable String job) {
        return workerService.getWorkersByJob(job);
    }

    // البحث بالعنوان
    @GetMapping("/address/{address}")
    public List<Worker> getWorkersByAddress(@PathVariable String address) {
        return workerService.getWorkersByAddress(address);
    }
}