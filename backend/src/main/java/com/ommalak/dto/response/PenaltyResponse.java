package com.ommalak.dto.response;

import com.ommalak.entity.WorkerPenalty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class PenaltyResponse {
    private Long id;
    private String reason;
    private Double amount;
    private String adminName;
    private LocalDateTime createdAt;

    public static PenaltyResponse from(WorkerPenalty p) {
        return PenaltyResponse.builder()
                .id(p.getId())
                .reason(p.getReason())
                .amount(p.getAmount())
                .adminName(p.getAdmin().getFullName())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
