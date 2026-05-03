package com.ommalak.repository;

import com.ommalak.entity.User;
import com.ommalak.entity.WorkerPenalty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkerPenaltyRepository extends JpaRepository<WorkerPenalty, Long> {
    List<WorkerPenalty> findByWorkerOrderByCreatedAtDesc(User worker);
}
