package com.ommalak.dto.request;

import lombok.Data;

@Data
public class BookingRequest {
    private Long workerId;
    private String notes;
}
