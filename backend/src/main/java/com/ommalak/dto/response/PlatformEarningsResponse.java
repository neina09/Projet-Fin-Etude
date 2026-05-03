package com.ommalak.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class PlatformEarningsResponse {
    private Double totalRevenue;
    private Double totalWorkerEarnings;
    private Double totalPlatformFee;
    private int totalCompletedBookings;
    private List<WorkerEarningsResponse> perWorker;
}
