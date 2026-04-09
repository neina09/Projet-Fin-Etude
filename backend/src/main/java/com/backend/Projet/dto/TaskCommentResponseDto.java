package com.backend.Projet.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class TaskCommentResponseDto {
    private Long          id;
    private String        content;
    private String        authorName;
    private LocalDateTime createdAt;
}
