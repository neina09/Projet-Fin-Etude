package com.backend.Projet.service;

import com.backend.Projet.dto.*;
import com.backend.Projet.exception.BusinessException;
import com.backend.Projet.exception.ResourceNotFoundException;
import com.backend.Projet.model.Role;
import com.backend.Projet.model.User;
import com.backend.Projet.model.Worker;
import com.backend.Projet.repository.BookingRepository;
import com.backend.Projet.repository.NotificationRepository;
import com.backend.Projet.repository.OfferRepository;
import com.backend.Projet.repository.RatingRepository;
import com.backend.Projet.repository.TaskRepository;
import com.backend.Projet.repository.UserRepository;
import com.backend.Projet.repository.WorkerRepository;
import com.backend.Projet.util.MauritaniaPhoneUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final com.backend.Projet.mapper.UserMapper userMapper;
    private final SmsService smsService;
    private final WorkerRepository workerRepository;
    private final OfferRepository offerRepository;
    private final BookingRepository bookingRepository;
    private final RatingRepository ratingRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final FileStorageService fileStorageService;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            com.backend.Projet.mapper.UserMapper userMapper,
            SmsService smsService,
            WorkerRepository workerRepository,
            OfferRepository offerRepository,
            BookingRepository bookingRepository,
            RatingRepository ratingRepository,
            TaskRepository taskRepository,
            NotificationRepository notificationRepository,
            FileStorageService fileStorageService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.smsService = smsService;
        this.workerRepository = workerRepository;
        this.offerRepository = offerRepository;
        this.bookingRepository = bookingRepository;
        this.ratingRepository = ratingRepository;
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public UserResponseDto signup(RegisterUserDto input) {
        String normalizedPhone = MauritaniaPhoneUtils.normalize(input.getPhone());
        if (userRepository.findByPhone(normalizedPhone).isPresent()) {
            throw new BusinessException("Phone already in use");
        }
        User user = new User(input.getUsername(), normalizedPhone, passwordEncoder.encode(input.getPassword()));
        user.setRole(Role.USER);
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationCode(user);
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    public User authenticate(LoginUserDto input) {
        String normalizedPhone = MauritaniaPhoneUtils.normalize(input.getPhone());
        User user = userRepository.findByPhone(normalizedPhone)
                .orElseThrow(() -> new BadCredentialsException("Invalid phone or password"));
        if (!user.isEnabled()) {
            throw new BusinessException("Account not verified. Please verify your account.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedPhone, input.getPassword())
        );
        return user;
    }

    @Transactional
    public void verifyUser(VerifyUserDto input) {
        String normalizedPhone = MauritaniaPhoneUtils.normalize(input.getPhone());
        User user = userRepository.findByPhone(normalizedPhone)
                .orElseThrow(() -> new BusinessException("Invalid verification code or phone"));

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
        String normalizedPhone = MauritaniaPhoneUtils.normalize(phone);
        Optional<User> optionalUser = userRepository.findByPhone(normalizedPhone);
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
            log.info("Verification code requested for unknown phone {}", normalizedPhone);
        }
    }

    @Transactional
    public void forgotPassword(String phone) {
        String normalizedPhone = MauritaniaPhoneUtils.normalize(phone);
        Optional<User> optionalUser = userRepository.findByPhone(normalizedPhone);
        if (optionalUser.isEmpty()) {
            log.info("Reset password requested for unknown phone {}", normalizedPhone);
            return;
        }

        User user = optionalUser.get();
        String token = generateVerificationCode();
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        smsService.sendPasswordResetToken(user.getPhone(), token);
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
            String normalizedPhone = MauritaniaPhoneUtils.normalize(input.getPhone());
            Optional<User> existingUser = userRepository.findByPhone(normalizedPhone);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(currentUser.getId())) {
                throw new BusinessException("Phone already in use");
            }
            currentUser.setPhone(normalizedPhone);
        }
        User saved = userRepository.save(currentUser);
        return userMapper.toDto(saved);
    }

    @Transactional
    public void deleteAccount(User currentUser) {
        User managedUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Long userId = managedUser.getId();

        log.info("Starting account deletion for user ID: {}", userId);

        // 1. Independent child records
        notificationRepository.deleteByUserId(userId);

        // 2. Worker-related data (if applicable)
        Worker worker = workerRepository.findByUserId(userId).orElse(null);
        if (worker != null) {
            Long workerId = worker.getId();
            log.info("User is a worker (ID: {}). Cleaning up worker data.", workerId);

            ratingRepository.deleteByTaskAssignedWorkerId(workerId);
            taskRepository.clearAssignedWorkerByWorkerId(workerId);
            ratingRepository.deleteByBookingWorkerId(workerId); // Delete ratings of bookings the worker performed
            ratingRepository.deleteByWorkerId(workerId);        // Delete general ratings for this worker
            offerRepository.deleteByWorkerId(workerId);
            bookingRepository.deleteByWorkerId(workerId);
            fileStorageService.deleteStoredFile(worker.getImageUrl());
            fileStorageService.deleteStoredFile(worker.getIdentityDocumentUrl());
            workerRepository.delete(worker);
        }

        // 3. User-related data as a customer
        // Delete ratings of bookings the user made
        ratingRepository.deleteByBookingUserId(userId);
        // Delete ratings the user wrote
        ratingRepository.deleteByUserId(userId);
        
        // Delete offers on tasks owned by this user
        offerRepository.deleteByTaskUserId(userId);
        
        // Delete bookings the user created
        bookingRepository.deleteByUserId(userId);
        
        // Delete tasks the user created
        taskRepository.deleteByUserId(userId);

        // 4. Finally delete the user
        userRepository.delete(managedUser);
        log.info("Successfully deleted user ID: {}", userId);
    }



    private void sendVerificationCode(User user) {
        smsService.sendVerificationCode(user.getPhone(), user.getVerificationCode());
    }

    private String generateVerificationCode() {
        int code = SECURE_RANDOM.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
