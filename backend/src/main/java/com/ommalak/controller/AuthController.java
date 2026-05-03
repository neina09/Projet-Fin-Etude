package com.ommalak.controller;

import com.ommalak.dto.request.*;
import com.ommalak.dto.response.AuthResponse;
import com.ommalak.dto.response.UserResponse;
import com.ommalak.entity.User;
import com.ommalak.service.AuthService;
import com.ommalak.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody OtpRequest req) {
        otpService.sendOtp(req.getPhone());
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody OtpRequest req) {
        otpService.verifyOtp(req.getPhone(), req.getCode());
        return ResponseEntity.ok(Map.of("message", "OTP verified"));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.getProfile(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@AuthenticationPrincipal User user,
                                                 @RequestBody WorkerProfileRequest req) {
        return ResponseEntity.ok(authService.updateProfile(user, req));
    }

    @PostMapping("/become-worker")
    public ResponseEntity<Map<String, String>> becomeWorker(@AuthenticationPrincipal User user,
                                                            @RequestBody WorkerProfileRequest req) {
        authService.becomeWorker(user, req);
        return ResponseEntity.ok(Map.of("message", "Worker profile submitted for review"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody OtpRequest req) {
        otpService.sendOtp(req.getPhone());
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}
