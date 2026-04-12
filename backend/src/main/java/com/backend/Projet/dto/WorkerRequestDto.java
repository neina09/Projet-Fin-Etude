package com.backend.Projet.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerRequestDto {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+222|222)?[2-4][0-9]{7}$", message = "Phone number must be a valid Mauritanian number")
    private String phoneNumber;

    @Size(max = 2048, message = "Image URL must not exceed 2048 characters")
    private String imageUrl;

    @NotBlank(message = "Job is required")
    @Size(max = 100, message = "Job must not exceed 100 characters")
    private String job;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @Min(value = 0, message = "Salary must be positive")
    private int salary;

    @NotBlank(message = "National ID number is required")
    @Size(min = 6, max = 30, message = "National ID number must be between 6 and 30 characters")
    private String nationalIdNumber;
}
