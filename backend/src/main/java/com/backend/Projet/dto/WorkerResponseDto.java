package com.backend.Projet.dto;

import com.backend.Projet.model.WorkerAvailability;
import lombok.*;

@Data
@Builder
public class WorkerResponseDto {
    private Long id;
    private String name;
    private String job;
    private String address;
    private int salary;
    private String imageUrl;
    private String phoneNumber;
    private WorkerAvailability availability;
    private double averageRating;
}