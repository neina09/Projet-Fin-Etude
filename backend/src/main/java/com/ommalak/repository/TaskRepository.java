package com.ommalak.repository;

import com.ommalak.entity.Task;
import com.ommalak.entity.User;
import com.ommalak.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByClient(User client);
    List<Task> findByStatusOrderByCreatedAtDesc(TaskStatus status);
    List<Task> findAllByOrderByCreatedAtDesc();
    long countByStatus(TaskStatus status);
    List<Task> findByStatusAndAssignedWorkerIsNotNull(TaskStatus status);
}
