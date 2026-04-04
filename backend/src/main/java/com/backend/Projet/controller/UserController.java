package com.backend.Projet.controller;

import com.backend.Projet.dto.ChangePasswordDto;
import com.backend.Projet.dto.UpdateProfileDto;
import com.backend.Projet.dto.UserResponseDto;
import com.backend.Projet.model.User;
import com.backend.Projet.service.AuthenticationService;
import com.backend.Projet.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    public UserController(UserService userService, AuthenticationService authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> authenticatedUser(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(UserResponseDto.builder()
                .id(currentUser.getId())
                .username(currentUser.getName())
                .email(currentUser.getEmail())
                .build());
    }

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> allUsers() {
        return ResponseEntity.ok(userService.allUsers());
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordDto input,
            @AuthenticationPrincipal User currentUser) {
        try {
            authenticationService.changePassword(currentUser, input);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateProfileDto input,
            @AuthenticationPrincipal User currentUser) {
        try {
            UserResponseDto updatedUser = authenticationService.updateProfile(currentUser, input);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(
            @AuthenticationPrincipal User currentUser) {
        try {
            authenticationService.deleteAccount(currentUser);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}