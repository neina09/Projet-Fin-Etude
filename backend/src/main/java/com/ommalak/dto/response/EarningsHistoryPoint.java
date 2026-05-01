package com.ommalak.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class EarningsHistoryPoint {
    private String label;
    private Double revenue;
    private Double workerEarnings;
    private Double platformFee;
}
