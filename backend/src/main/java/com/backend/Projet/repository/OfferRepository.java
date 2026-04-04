// OfferRepository.java
package com.backend.Projet.repository;

import com.backend.Projet.model.Offer;
import com.backend.Projet.model.OfferStatus;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer>  findByTaskId(Long taskId);
    Page<Offer>  findByTaskId(Long taskId, Pageable pageable);
    List<Offer>  findByWorkerUserId(Long userId);
    List<Offer>  findByTaskIdAndStatus(Long taskId, OfferStatus status);
    boolean      existsByTaskIdAndWorkerId(Long taskId, Long workerId);
}