package com.backend.Projet.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ChatRequestDto {
    private Long recipientId;
    
    @NotBlank(message = "Message content cannot be empty")
    private String content;
}
