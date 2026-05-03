package com.ommalak.service;

import com.ommalak.entity.OtpCode;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpCodeRepository otpCodeRepository;

    @Value("${app.otp.dev-mode}")
    private boolean devMode;

    @Value("${app.otp.expiry-minutes}")
    private int expiryMinutes;

    @Transactional
    public void sendOtp(String phone) {
        otpCodeRepository.deleteByPhone(phone);

        String code = String.format("%06d", new Random().nextInt(999999));
        OtpCode otp = OtpCode.builder()
                .phone(phone)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
                .build();
        otpCodeRepository.save(otp);

        if (devMode) {
            log.info("═══════════════════════════════════");
            log.info("  OTP for {} : {}", phone, code);
            log.info("═══════════════════════════════════");
        } else {
            // Plug in your SMS provider here (e.g. Twilio, InfoBip)
            // smsProvider.send(phone, "Your Ommalak code: " + code);
        }
    }

    @Transactional
    public void verifyOtp(String phone, String code) {
        OtpCode otp = otpCodeRepository.findTopByPhoneAndUsedFalseOrderByIdDesc(phone)
                .orElseThrow(() -> new ApiException("No OTP found for this number"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException("OTP has expired");
        }
        if (!otp.getCode().equals(code)) {
            throw new ApiException("Invalid OTP code");
        }
        otp.setUsed(true);
        otpCodeRepository.save(otp);
    }
}
