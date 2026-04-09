package com.backend.Projet.dto;

import com.backend.Projet.model.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String role;
}