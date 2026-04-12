package com.backend.Projet.service;

import com.backend.Projet.dto.*;
import com.backend.Projet.exception.BusinessException;
import com.backend.Projet.exception.ResourceNotFoundException;
import com.backend.Projet.model.Role;
import com.backend.Projet.model.User;
import com.backend.Projet.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final com.backend.Projet.mapper.UserMapper userMapper;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            com.backend.Projet.mapper.UserMapper userMapper
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Transactional
    public UserResponseDto signup(RegisterUserDto input) {
        if (userRepository.findByPhone(input.getPhone()).isPresent()) {
            throw new BusinessException("Phone already in use");
        }
        User user = new User(input.getUsername(), input.getPhone(), passwordEncoder.encode(input.getPassword()));
        user.setRole(Role.USER);
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationCode(user);
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    public User authenticate(LoginUserDto input) {
        User user = userRepository.findByPhone(input.getPhone())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.isEnabled()) {
            throw new BusinessException("Account not verified. Please verify your account.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.getPhone(), input.getPassword())
        );
        return user;
    }

    @Transactional
    public void verifyUser(VerifyUserDto input) {
        User user = userRepository.findByPhone(input.getPhone())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getVerificationCode() == null || user.getVerificationCodeExpiresAt() == null) {
            throw new BusinessException("No verification code found for this account");
        }

        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Verification code has expired");
        }
        if (user.getVerificationCode().equals(input.getVerificationCode())) {
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            userRepository.save(user);
        } else {
            throw new BusinessException("Invalid verification code");
        }
    }

    @Transactional
    public void resendVerificationCode(String phone) {
        Optional<User> optionalUser = userRepository.findByPhone(phone);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new BusinessException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationCode(user);
            userRepository.save(user);
        } else {
            log.info("Verification code requested for unknown phone {}", phone);
        }
    }

    @Transactional
    public void forgotPassword(String phone) {
        Optional<User> optionalUser = userRepository.findByPhone(phone);
        if (optionalUser.isEmpty()) {
            log.info("Reset password requested for unknown phone {}", phone);
            return;
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        log.info("Reset password token for phone {}: {}", user.getPhone(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordDto input) {
        User user = userRepository.findByResetPasswordToken(input.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired reset token"));
        if (user.getResetPasswordExpiresAt() == null || user.getResetPasswordExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Reset token has expired");
        }
        user.setPassword(passwordEncoder.encode(input.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiresAt(null);
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(User currentUser, ChangePasswordDto input) {
        if (!passwordEncoder.matches(input.getCurrentPassword(), currentUser.getPassword())) {
            throw new BusinessException("Current password is incorrect");
        }
        currentUser.setPassword(passwordEncoder.encode(input.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Transactional
    public UserResponseDto updateProfile(User currentUser, UpdateProfileDto input) {
        if (input.getUsername() != null && !input.getUsername().isBlank()) {
            currentUser.setUsername(input.getUsername());
        }
        if (input.getPhone() != null && !input.getPhone().isBlank()) {
            Optional<User> existingUser = userRepository.findByPhone(input.getPhone());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(currentUser.getId())) {
                throw new BusinessException("Phone already in use");
            }
            currentUser.setPhone(input.getPhone());
        }
        User saved = userRepository.save(currentUser);
        return userMapper.toDto(saved);
    }

    @Transactional
    public void deleteAccount(User currentUser) {
        userRepository.delete(currentUser);
    }


    private void sendVerificationCode(User user) {
        log.info("Verification code for phone {}: {}", user.getPhone(), user.getVerificationCode());
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
