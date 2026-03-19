package com.backend.Projet.service;

import com.backend.Projet.model.Worker;
import com.backend.Projet.repository.WorkerRepository;
import com.backend.Projet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;

    // إنشاء عامل
    public Worker createWorker(Worker worker) {
        return workerRepository.save(worker);
    }

    // الحصول على كل العمال
    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    // البحث بعامل واحد
    public Worker getWorkerById(Long id) {
        return workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
    }

    // تعديل عامل
    public Worker updateWorker(Long id, Worker updatedWorker) {
        Worker worker = getWorkerById(id);
        worker.setName(updatedWorker.getName());
        worker.setPhoneNumber(updatedWorker.getPhoneNumber());
        worker.setJob(updatedWorker.getJob());
        worker.setAddress(updatedWorker.getAddress());
        worker.setSalary(updatedWorker.getSalary());
        worker.setImageUrl(updatedWorker.getImageUrl());
        return workerRepository.save(worker);
    }

    // حذف عامل
    public void deleteWorker(Long id) {
        Worker worker = getWorkerById(id);
        workerRepository.delete(worker);
    }

    // البحث بالعنوان
    public List<Worker> getWorkersByAddress(String address) {
        return workerRepository.findByAddress(address);
    }

    // البحث بالمهنة
    public List<Worker> getWorkersByJob(String job) {
        return workerRepository.findByJob(job);
    }
}