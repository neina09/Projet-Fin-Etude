package com.ommalak.repository;

import com.ommalak.entity.Offer;
import com.ommalak.entity.Task;
import com.ommalak.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByTask(Task task);
    boolean existsByTaskAndWorker(Task task, User worker);
}
