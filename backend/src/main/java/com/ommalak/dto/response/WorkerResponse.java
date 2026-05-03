package com.ommalak.dto.response;

import com.ommalak.entity.WorkerProfile;
import com.ommalak.enums.Availability;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class WorkerResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String city;
    private String profession;
    private Double salaryExpectation;
    private String bio;
    private String profilePictureUrl;
    private List<String> portfolioPhotos;
    private List<String> skills;
    private Availability availability;
    private boolean verified;
    private double rating;
    private int reviewCount;
    private List<ReviewResponse> reviews;

    public static WorkerResponse from(WorkerProfile wp) {
        return WorkerResponse.builder()
                .id(wp.getUser().getId())
                .fullName(wp.getUser().getFullName())
                .phone(wp.getUser().getPhone())
                .city(wp.getUser().getCity())
                .profession(wp.getProfession())
                .salaryExpectation(wp.getSalaryExpectation())
                .bio(wp.getBio())
                .profilePictureUrl(wp.getProfilePictureUrl())
                .portfolioPhotos(wp.getPortfolioPhotos())
                .skills(wp.getSkills())
                .availability(wp.getAvailability())
                .verified(wp.isVerified())
                .rating(wp.getRating())
                .reviewCount(wp.getReviewCount())
                .build();
    }
}
