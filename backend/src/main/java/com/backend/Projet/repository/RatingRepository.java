// RatingRepository.java
package com.backend.Projet.repository;

import com.backend.Projet.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByBookingId(Long bookingId);
    List<Rating>     findByWorkerId(Long workerId);

    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.worker.id = :workerId")
    Double calculateAverageRating(Long workerId);
}