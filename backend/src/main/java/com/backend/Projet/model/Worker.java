package com.backend.Projet.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "workers", indexes = {
        @Index(name = "idx_worker_user_id",      columnList = "user_id"),
        @Index(name = "idx_worker_job",          columnList = "job"),
        @Index(name = "idx_worker_availability", columnList = "availability")
})
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Phone number is required")
    @Column(name = "phone_number", unique = true, nullable = false)
    @JsonProperty("phoneNumber")
    private String phoneNumber;

    @Column(name = "image_url")
    private String imageUrl;

    @NotBlank(message = "Job is required")
    @Column(nullable = false)
    @JsonProperty("job")
    private String job;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    @JsonProperty("name")
    private String name;

    @NotBlank(message = "Address is required")
    @Column(name = "adresse", nullable = false)
    @JsonProperty("address")
    private String address;

    @Min(value = 0, message = "Salary must be positive")
    @Column(nullable = false)
    @JsonProperty("salary")
    private int salary;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WorkerAvailability availability = WorkerAvailability.AVAILABLE;

    @Column(name = "average_rating")
    @Builder.Default
    private double averageRating = 0.0;
}