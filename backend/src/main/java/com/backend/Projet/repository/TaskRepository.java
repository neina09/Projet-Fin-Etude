// TaskRepository.java
package com.backend.Projet.repository;

import com.backend.Projet.model.Task;
import com.backend.Projet.model.TaskStatus;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByUserId(Long userId, Pageable pageable);
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    List<Task> findByUserId(Long userId);

    @Query("""
        SELECT t FROM Task t
        WHERE t.status = :status
        AND (:address IS NULL
             OR LOWER(t.address) LIKE LOWER(CONCAT('%',:address,'%')))
        AND (:keyword IS NULL
             OR LOWER(t.title) LIKE LOWER(CONCAT('%',:keyword,'%'))
             OR LOWER(t.description) LIKE LOWER(CONCAT('%',:keyword,'%')))
        ORDER BY t.createdAt DESC
    """)
    Page<Task> searchOpenTasks(
            @Param("status")  TaskStatus status,
            @Param("address") String address,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}