package com.backend.Projet.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    @Value("${app.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${app.sms.sender-name:Khadamat MR}")
    private String senderName;

    public void sendVerificationCode(String phone, String verificationCode) {
        sendSms(phone, "Your verification code is: " + verificationCode);
    }

    public void sendPasswordResetToken(String phone, String token) {
        sendSms(phone, "Your password reset code is: " + token);
    }

    private void sendSms(String phone, String message) {
        if (!smsEnabled) {
            log.info("SMS disabled. Fallback message to {} from {}: {}", phone, senderName, message);
            return;
        }

        // Hook point for a real SMS provider integration.
        log.info("SMS provider integration pending. Message to {} from {}: {}", phone, senderName, message);
    }
}
