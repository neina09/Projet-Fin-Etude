package com.backend.Projet.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder
public class RatingResponseDto {
    private Long id;
    private Long workerId;
    private String workerName;
    private Long userId;
    private String userName;
    private Long bookingId;
    private int stars;
    private String comment;
    private LocalDateTime createdAt;
}
