package com.ommalak.dto.request;

import com.ommalak.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String fullName;
    @NotBlank private String phone;
    @NotBlank private String password;
    private String city;
    private UserRole role; // optional; defaults to CLIENT
}
