package com.backend.Projet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Phone number is required")
    @Column(name = "phone_number", unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "image_url")
    private String imageUrl;

    @NotBlank(message = "Job is required")
    @Column(nullable = false)
    private String job;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Address is required")
    @Column(name = "adresse", nullable = false)
    private String address;

    @Min(value = 0, message = "Salary must be positive")
    @Column(nullable = false)
    private int salary;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // بعد حقل user مباشرة
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WorkerAvailability availability = WorkerAvailability.AVAILABLE;

    @Column(name = "average_rating")
    @Builder.Default
    private double averageRating = 0.0;
}