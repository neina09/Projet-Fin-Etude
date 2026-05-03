package com.ommalak.dto.response;

import com.ommalak.entity.User;
import com.ommalak.entity.WorkerProfile;
import com.ommalak.enums.Availability;
import com.ommalak.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String phone;
    private UserRole role;
    private String city;
    private LocalDateTime createdAt;

    // Worker-specific fields (null for non-workers)
    private String profession;
    private Double salaryExpectation;
    private String bio;
    private Availability availability;
    private Boolean verified;
    private Double rating;

    public static UserResponse from(User user) {
        UserResponse.UserResponseBuilder builder = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .city(user.getCity())
                .createdAt(user.getCreatedAt());

        WorkerProfile wp = user.getWorkerProfile();
        if (wp != null) {
            builder.profession(wp.getProfession())
                   .salaryExpectation(wp.getSalaryExpectation())
                   .bio(wp.getBio())
                   .availability(wp.getAvailability())
                   .verified(wp.isVerified())
                   .rating(wp.getRating());
        }
        return builder.build();
    }
}
