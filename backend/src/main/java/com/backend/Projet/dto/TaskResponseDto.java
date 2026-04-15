package com.backend.Projet.dto;

import com.backend.Projet.model.TaskStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class TaskResponseDto {
    private Long          id;
    private String        title;
    private String        description;
    private String        address;
    private String        profession;
    private TaskStatus    status;
    private Long          userId;
    private String        userName;
    private Long          assignedWorkerId;
    private Long          assignedWorkerUserId;
    private String        assignedWorkerName;
    private LocalDateTime createdAt;
    private Double        latitude;
    private Double        longitude;
    private Double        distanceKm;
}
