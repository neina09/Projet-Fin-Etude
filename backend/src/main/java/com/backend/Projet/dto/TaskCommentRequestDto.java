package com.backend.Projet.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class TaskCommentRequestDto {

    @NotBlank(message = "Comment content is required")
    private String content;
}