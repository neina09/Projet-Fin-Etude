package com.ommalak.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank private String phone;
    @NotBlank private String code;
    @NotBlank private String password;
}
