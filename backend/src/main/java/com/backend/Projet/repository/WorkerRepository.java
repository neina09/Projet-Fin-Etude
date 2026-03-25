package com.backend.Projet.repository;

import com.backend.Projet.model.Worker;
import com.backend.Projet.model.WorkerAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByUserId(Long userId);
    Optional<Worker> findByPhoneNumber(String phoneNumber);
    List<Worker> findByAddress(String address);
    List<Worker> findByJob(String job);
    List<Worker> findByAvailability(WorkerAvailability availability);
}