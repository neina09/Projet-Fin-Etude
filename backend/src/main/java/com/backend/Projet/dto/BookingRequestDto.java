// BookingRequestDto.java
package com.backend.Projet.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
public class BookingRequestDto {
    private Long workerId;
    private String description;
    private String address;
    private LocalDateTime bookingDate;
    private Double price;
}