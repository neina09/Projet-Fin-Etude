package com.ommalak.dto.request;

import lombok.Data;

@Data
public class PenaltyRequest {
    private String reason;
    private Double amount;
}
