package com.backend.Projet.mapper;

import com.backend.Projet.dto.TaskResponseDto;
import com.backend.Projet.model.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponseDto toDto(Task task) {
        if (task == null) {
            return null;
        }
        return TaskResponseDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .address(task.getAddress())
                .status(task.getStatus())
                .userId(task.getUser().getId())
                .userName(task.getUser().getName())
                .assignedWorkerId(
                        task.getAssignedWorker() != null ? task.getAssignedWorker().getId() : null)
                .assignedWorkerName(
                        task.getAssignedWorker() != null ? task.getAssignedWorker().getName() : null)
                .createdAt(task.getCreatedAt())
                .build();
    }
}
