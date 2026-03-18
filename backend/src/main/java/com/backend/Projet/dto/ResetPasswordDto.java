package com.backend.Projet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDto {
    private String token;
    private String newPassword;
}