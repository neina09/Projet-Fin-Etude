package com.backend.Projet.service;

import com.backend.Projet.dto.NotificationResponseDto;
import com.backend.Projet.exception.ResourceNotFoundException;
import com.backend.Projet.exception.UnauthorizedException;
import com.backend.Projet.model.Notification;
import com.backend.Projet.model.NotificationType;
import com.backend.Projet.model.User;
import com.backend.Projet.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private NotificationResponseDto toDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    @Transactional
    public void sendNotification(User target, String msg, NotificationType type) {
        Notification notification = Notification.builder()
                .user(target)
                .message(msg)
                .type(type)
                .build();
        notificationRepository.save(notification);
    }

    public List<NotificationResponseDto> getMyNotifications(User currentUser) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public void markAsRead(Long notificationId, User currentUser) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        // FIX: كانت ResourceNotFoundException — الصح هو UnauthorizedException
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Not authorized to read this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}