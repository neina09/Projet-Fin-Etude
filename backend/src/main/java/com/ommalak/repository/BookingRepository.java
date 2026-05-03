package com.ommalak.repository;

import com.ommalak.entity.Booking;
import com.ommalak.entity.User;
import com.ommalak.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByClientOrderByCreatedAtDesc(User client);
    List<Booking> findByWorkerOrderByCreatedAtDesc(User worker);
    long count();

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.status = 'COMPLETED' AND b.price IS NOT NULL AND b.worker = :worker")
    List<Booking> findCompletedByWorker(@Param("worker") User worker);

    @Query("SELECT b FROM Booking b WHERE b.status = 'COMPLETED' AND b.price IS NOT NULL AND b.createdAt BETWEEN :from AND :to ORDER BY b.createdAt ASC")
    List<Booking> findCompletedInRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COALESCE(SUM(b.price), 0) FROM Booking b WHERE b.status = 'COMPLETED' AND b.price IS NOT NULL")
    Double sumCompletedRevenue();
}
