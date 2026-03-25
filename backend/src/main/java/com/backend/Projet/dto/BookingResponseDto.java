// BookingResponseDto.java
package com.backend.Projet.dto;

import com.backend.Projet.model.BookingStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long workerId;
    private String workerName;
    private String workerJob;
    private BookingStatus status;
    private String description;
    private String address;
    private LocalDateTime bookingDate;
    private Double price;
    private LocalDateTime createdAt;
}