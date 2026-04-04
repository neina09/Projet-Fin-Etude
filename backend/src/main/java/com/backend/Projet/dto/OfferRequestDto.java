package com.backend.Projet.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class OfferRequestDto {

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private Double price;
}