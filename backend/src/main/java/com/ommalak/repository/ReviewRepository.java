package com.ommalak.repository;

import com.ommalak.entity.Review;
import com.ommalak.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByWorker(User worker);
    boolean existsByWorkerAndClient(User worker, User client);
}
