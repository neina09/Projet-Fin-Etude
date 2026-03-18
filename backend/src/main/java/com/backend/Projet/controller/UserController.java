package com.backend.Projet.controller;

import com.backend.Projet.dto.ChangePasswordDto;
import com.backend.Projet.dto.UpdateProfileDto;
import com.backend.Projet.model.User;
import com.backend.Projet.service.AuthenticationService;
import com.backend.Projet.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<User> authenticatedUser() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userService.allUsers());
    }

    // ← جديد
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto input) {
        try {
            authenticationService.changePassword(getCurrentUser(), input);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ← جديد
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileDto input) {
        try {
            User updatedUser = authenticationService.updateProfile(getCurrentUser(), input);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ← جديد
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount() {
        try {
            authenticationService.deleteAccount(getCurrentUser());
            return ResponseEntity.ok("Account deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}