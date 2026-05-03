package com.ommalak.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    private String profession;
    private String city;
    private Double budget;
}
