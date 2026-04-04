package com.backend.Projet.dto;

import com.backend.Projet.model.OfferStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder
public class OfferResponseDto {
    private Long          id;
    private Long          taskId;
    private String        taskTitle;
    private Long          workerId;
    private String        workerName;
    private String        workerJob;
    private String        message;
    private Double        price;
    private OfferStatus   status;
    private LocalDateTime createdAt;
}