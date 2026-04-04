package com.backend.Projet.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
public class BookingRequestDto {

    @NotNull(message = "Worker ID is required")
    private Long workerId;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Booking date is required")
    private LocalDateTime bookingDate;

    @Min(value = 0, message = "Price must be positive")
    private Double price;
}