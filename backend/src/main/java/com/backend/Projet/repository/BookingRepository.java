// BookingRepository.java
package com.backend.Projet.repository;

import com.backend.Projet.model.Booking;
import com.backend.Projet.model.BookingStatus;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByUserId(Long userId, Pageable pageable);
    Page<Booking> findByWorkerUserId(Long userId, Pageable pageable);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByWorkerUserId(Long userId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
    List<Booking> findByWorkerUserIdAndStatus(Long userId, BookingStatus status);
}