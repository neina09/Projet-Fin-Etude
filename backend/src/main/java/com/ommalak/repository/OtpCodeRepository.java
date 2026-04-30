package com.ommalak.repository;

import com.ommalak.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    Optional<OtpCode> findTopByPhoneAndUsedFalseOrderByIdDesc(String phone);
    void deleteByPhone(String phone);
}
