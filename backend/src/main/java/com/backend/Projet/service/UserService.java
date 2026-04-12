package com.backend.Projet.service;

import com.backend.Projet.dto.UserResponseDto;
import com.backend.Projet.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponseDto> allUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .username(user.getName())
                        .phone(user.getPhone())
                        .role(user.getRole() == null ? null : user.getRole().name())
                        .build())
                .toList();
    }
}
