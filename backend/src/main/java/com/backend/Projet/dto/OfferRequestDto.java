package com.backend.Projet.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class OfferRequestDto {

    @NotBlank(message = "Message is required")
    private String message;

}