package com.backend.Projet.service;

import com.backend.Projet.dto.LoginUserDto;
import com.backend.Projet.dto.RegisterUserDto;
import com.backend.Projet.dto.ResetPasswordDto;
import com.backend.Projet.dto.UserResponseDto;
import com.backend.Projet.dto.VerifyUserDto;
import com.backend.Projet.exception.BusinessException;
import com.backend.Projet.mapper.UserMapper;
import com.backend.Projet.model.User;
import com.backend.Projet.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SmsService smsService;

    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        authenticationService = new AuthenticationService(
                userRepository,
                authenticationManager,
                passwordEncoder,
                new UserMapper(),
                smsService
        );
    }

    @Test
    void signupShouldCreateDisabledUserUsingPhone() {
        RegisterUserDto dto = new RegisterUserDto();
        dto.setUsername("youssef");
        dto.setPhone("+22222123456");
        dto.setPassword("secret123");

        when(userRepository.findByPhone("22123456")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("hashed-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        UserResponseDto response = authenticationService.signup(dto);

        assertEquals("22123456", response.getPhone());
        assertEquals("youssef", response.getUsername());
        assertEquals("USER", response.getRole());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User savedUser = captor.getValue();
        assertEquals("22123456", savedUser.getPhone());
        assertFalse(savedUser.isEnabled());
        assertNotNull(savedUser.getVerificationCode());
        assertNotNull(savedUser.getVerificationCodeExpiresAt());
        verify(smsService).sendVerificationCode(eq("22123456"), anyString());
    }

    @Test
    void authenticateShouldUsePhoneCredentials() {
        LoginUserDto dto = new LoginUserDto();
        dto.setPhone("+22222123456");
        dto.setPassword("secret123");

        User user = new User();
        user.setId(1L);
        user.setPhone("22123456");
        user.setPassword("hashed");
        user.setEnabled(true);

        when(userRepository.findByPhone("22123456")).thenReturn(Optional.of(user));

        User authenticated = authenticationService.authenticate(dto);

        assertSame(user, authenticated);
        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("22123456", "secret123")
        );
    }

    @Test
    void verifyUserShouldEnableAccountAndClearVerificationData() {
        VerifyUserDto dto = new VerifyUserDto();
        dto.setPhone("22123456");
        dto.setVerificationCode("123456");

        User user = new User();
        user.setPhone("22123456");
        user.setVerificationCode("123456");
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(5));
        user.setEnabled(false);

        when(userRepository.findByPhone(dto.getPhone())).thenReturn(Optional.of(user));

        authenticationService.verifyUser(dto);

        assertTrue(user.isEnabled());
        assertNull(user.getVerificationCode());
        assertNull(user.getVerificationCodeExpiresAt());
        verify(userRepository).save(user);
    }

    @Test
    void forgotPasswordShouldIgnoreUnknownPhone() {
        when(userRepository.findByPhone("22111111")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> authenticationService.forgotPassword("22111111"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void resetPasswordShouldRejectExpiredToken() {
        ResetPasswordDto dto = new ResetPasswordDto();
        dto.setToken("expired-token");
        dto.setNewPassword("new-secret");

        User user = new User();
        user.setResetPasswordToken("expired-token");
        user.setResetPasswordExpiresAt(LocalDateTime.now().minusMinutes(1));

        when(userRepository.findByResetPasswordToken("expired-token")).thenReturn(Optional.of(user));

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authenticationService.resetPassword(dto));

        assertEquals("Reset token has expired", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}
