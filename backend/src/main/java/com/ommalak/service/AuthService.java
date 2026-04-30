package com.ommalak.service;

import com.ommalak.dto.request.*;
import com.ommalak.dto.response.AuthResponse;
import com.ommalak.dto.response.UserResponse;
import com.ommalak.entity.User;
import com.ommalak.entity.WorkerProfile;
import com.ommalak.enums.UserRole;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.UserRepository;
import com.ommalak.repository.WorkerProfileRepository;
import com.ommalak.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

    public void sendOtp(String phone) {
        otpService.sendOtp(phone);
    }

    public void verifyOtp(String phone, String code) {
        otpService.verifyOtp(phone, code);
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new ApiException("Phone number already registered");
        }
        UserRole role = (req.getRole() != null) ? req.getRole() : UserRole.CLIENT;
        User user = User.builder()
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .city(req.getCity())
                .build();
        userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(token).user(UserResponse.from(user)).build();
    }

    public AuthResponse login(LoginRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getPhone(), req.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new ApiException("Invalid phone or password", HttpStatus.UNAUTHORIZED);
        }
        User user = userRepository.findByPhone(req.getPhone()).orElseThrow();
        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(token).user(UserResponse.from(user)).build();
    }

    public UserResponse getProfile(User user) {
        User fresh = userRepository.findById(user.getId()).orElseThrow();
        return UserResponse.from(fresh);
    }

    @Transactional
    public UserResponse updateProfile(User user, WorkerProfileRequest req) {
        user.setCity(req.getCity() != null ? req.getCity() : user.getCity());
        userRepository.save(user);
        return UserResponse.from(user);
    }

    @Transactional
    public void becomeWorker(User user, WorkerProfileRequest req) {
        if (user.getRole() == UserRole.WORKER) throw new ApiException("Already a worker");
        user.setRole(UserRole.WORKER);
        userRepository.save(user);

        WorkerProfile wp = WorkerProfile.builder()
                .user(user)
                .profession(req.getProfession())
                .salaryExpectation(req.getSalaryExpectation())
                .bio(req.getBio())
                .idDocumentUrl(req.getIdDocumentUrl())
                .build();
        workerProfileRepository.save(wp);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        otpService.verifyOtp(req.getPhone(), req.getCode());
        User user = userRepository.findByPhone(req.getPhone())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
    }
}
