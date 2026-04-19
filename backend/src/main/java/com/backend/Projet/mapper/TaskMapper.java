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
        String assignedWorkerImageUrl = null;
        if (task.getAssignedWorker() != null) {
            assignedWorkerImageUrl = task.getAssignedWorker().getImageUrl();
            if ((assignedWorkerImageUrl == null || assignedWorkerImageUrl.isBlank())
                    && task.getAssignedWorker().getUser() != null
                    && task.getAssignedWorker().getUser().getImageUrl() != null
                    && !task.getAssignedWorker().getUser().getImageUrl().isBlank()) {
                assignedWorkerImageUrl = task.getAssignedWorker().getUser().getImageUrl();
            }
        }
        return TaskResponseDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .address(task.getAddress())
                .profession(task.getProfession())
                .status(task.getStatus())
                .userId(task.getUser().getId())
                .userName(task.getUser().getName())
                .userImageUrl(task.getUser().getImageUrl())
                .assignedWorkerId(
                        task.getAssignedWorker() != null ? task.getAssignedWorker().getId() : null)
                .assignedWorkerUserId(
                        task.getAssignedWorker() != null ? task.getAssignedWorker().getUser().getId() : null)
                .assignedWorkerName(
                        task.getAssignedWorker() != null ? task.getAssignedWorker().getName() : null)
                .assignedWorkerImageUrl(assignedWorkerImageUrl)
                .createdAt(task.getCreatedAt())
                .latitude(task.getLatitude())
                .longitude(task.getLongitude())
                .build();
    }
}
