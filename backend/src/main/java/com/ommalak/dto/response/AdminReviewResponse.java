package com.ommalak.dto.response;

import com.ommalak.entity.Review;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class AdminReviewResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private String clientPhone;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public static AdminReviewResponse from(Review r) {
        return AdminReviewResponse.builder()
                .id(r.getId())
                .clientId(r.getClient().getId())
                .clientName(r.getClient().getFullName())
                .clientPhone(r.getClient().getPhone())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
