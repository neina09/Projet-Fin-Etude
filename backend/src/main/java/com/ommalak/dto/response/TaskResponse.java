package com.ommalak.dto.response;

import com.ommalak.entity.Task;
import com.ommalak.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String profession;
    private String city;
    private Double budget;
    private TaskStatus status;
    private Long clientId;
    private String clientName;
    private Long assignedWorkerId;
    private int offersCount;
    private LocalDateTime createdAt;

    public static TaskResponse from(Task task, int offersCount) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .profession(task.getProfession())
                .city(task.getCity())
                .budget(task.getBudget())
                .status(task.getStatus())
                .clientId(task.getClient().getId())
                .clientName(task.getClient().getFullName())
                .assignedWorkerId(task.getAssignedWorker() != null ? task.getAssignedWorker().getId() : null)
                .offersCount(offersCount)
                .createdAt(task.getCreatedAt())
                .build();
    }
}
