package com.backend.Projet.config;

import com.backend.Projet.model.Role;
import com.backend.Projet.model.User;
import com.backend.Projet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ✅ تحقق أولاً — إن كان موجود لا تنشئه مجدداً
        if (userRepository.findByEmail("admin@admin.com").isPresent()) {
            return; // موجود مسبقاً — توقف هنا
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@admin.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);

        userRepository.save(admin);
        System.out.println("✅ Admin created: admin@admin.com / admin123");
    }
}