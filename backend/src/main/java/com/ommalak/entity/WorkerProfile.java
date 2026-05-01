package com.ommalak.entity;

import com.ommalak.enums.Availability;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "worker_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String profession;
    private Double salaryExpectation;
    private String bio;
    private String idDocumentUrl;
    private String profilePictureUrl;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "worker_portfolio_photos", joinColumns = @JoinColumn(name = "worker_profile_id"))
    @Column(name = "photo_url")
    @Builder.Default
    private List<String> portfolioPhotos = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Availability availability = Availability.AVAILABLE;

    @Builder.Default
    private boolean verified = false;

    @Builder.Default
    private double rating = 0.0;

    @Builder.Default
    private int reviewCount = 0;
}
