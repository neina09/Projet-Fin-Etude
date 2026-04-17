package com.backend.Projet.service;

import com.backend.Projet.exception.BusinessException;
import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
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

    @Value("${app.sms.twilio.account-sid:}")
    private String accountSid;

    @Value("${app.sms.twilio.api-key:}")
    private String apiKey;

    @Value("${app.sms.twilio.api-secret:}")
    private String apiSecret;

    @Value("${app.sms.twilio.from-number:}")
    private String fromNumber;

    @Value("${app.sms.twilio.messaging-service-sid:}")
    private String messagingServiceSid;

    @PostConstruct
    void initializeTwilio() {
        if (!smsEnabled) {
            return;
        }

        if (isBlank(accountSid) || isBlank(apiKey) || isBlank(apiSecret)) {
            throw new IllegalStateException("SMS is enabled but Twilio credentials are incomplete");
        }

        Twilio.init(apiKey, apiSecret, accountSid);
        log.info("Twilio SMS service initialized successfully");
    }

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

        try {
            var creator = isBlank(messagingServiceSid)
                    ? Message.creator(new PhoneNumber(phone), resolveFromNumber(), message)
                    : Message.creator(new PhoneNumber(phone), messagingServiceSid, message);

            creator.create();
            log.info("SMS sent successfully to {}", phone);
        } catch (ApiException ex) {
            log.error("Twilio rejected SMS to {}: {}", phone, ex.getMessage(), ex);
            throw new BusinessException("Failed to send SMS");
        } catch (Exception ex) {
            log.error("Unexpected SMS error for {}: {}", phone, ex.getMessage(), ex);
            throw new BusinessException("Failed to send SMS");
        }
    }

    private PhoneNumber resolveFromNumber() {
        if (isBlank(fromNumber)) {
            throw new BusinessException("Twilio sender number is not configured");
        }
        return new PhoneNumber(fromNumber);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
