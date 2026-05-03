package com.ommalak.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class StatsResponse {
    private long totalUsers;
    private long totalWorkers;
    private long totalTasks;
    private long totalBookings;
    private long pendingWorkers;
    private long openTasks;
    private long completedTasks;
}
