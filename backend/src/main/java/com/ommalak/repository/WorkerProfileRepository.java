package com.ommalak.repository;

import com.ommalak.entity.WorkerProfile;
import com.ommalak.enums.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    Optional<WorkerProfile> findByUserId(Long userId);

    @Query("SELECT w FROM WorkerProfile w JOIN w.user u WHERE w.verified = true " +
           "AND (:profession IS NULL OR w.profession = :profession) " +
           "AND (:availability IS NULL OR w.availability = :availability) " +
           "AND (:search IS NULL OR u.fullName LIKE %:search% OR w.profession LIKE %:search%)")
    List<WorkerProfile> search(@Param("profession") String profession,
                               @Param("availability") Availability availability,
                               @Param("search") String search);

    List<WorkerProfile> findByVerifiedFalse();
    long countByVerifiedTrue();
}
