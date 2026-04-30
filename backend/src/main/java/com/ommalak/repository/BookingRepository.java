package com.ommalak.repository;

import com.ommalak.entity.Booking;
import com.ommalak.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByClientOrderByCreatedAtDesc(User client);
    List<Booking> findByWorkerOrderByCreatedAtDesc(User worker);
    long count();
}
