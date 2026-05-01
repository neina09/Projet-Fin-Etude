package com.ommalak.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class WorkerEarningsResponse {
    private Long workerId;
    private String workerName;
    private String profession;
    private String profilePictureUrl;
    private int completedBookings;
    private Double totalRevenue;
    private Double workerEarnings;
    private Double platformFee;
}
