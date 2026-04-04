package com.backend.Projet.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerRequestDto {

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String imageUrl;

    @NotBlank(message = "Job is required")
    private String job;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @Min(value = 0, message = "Salary must be positive")
    private int salary;
}
