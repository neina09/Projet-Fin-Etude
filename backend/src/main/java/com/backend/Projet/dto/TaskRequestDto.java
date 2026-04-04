package com.backend.Projet.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class TaskRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String address;
}