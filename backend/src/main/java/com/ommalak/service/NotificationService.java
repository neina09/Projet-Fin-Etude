package com.ommalak.service;

import com.ommalak.dto.response.NotificationResponse;
import com.ommalak.entity.Notification;
import com.ommalak.entity.User;
import com.ommalak.enums.NotificationType;
import com.ommalak.exception.ApiException;
import com.ommalak.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void send(User user, NotificationType type, String message) {
        notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .build());
    }

    public List<NotificationResponse> getAll(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(NotificationResponse::from).toList();
    }

    @Transactional
    public void markRead(Long id, User user) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ApiException("Notification not found", HttpStatus.NOT_FOUND));
        if (!n.getUser().getId().equals(user.getId())) throw new ApiException("Forbidden", HttpStatus.FORBIDDEN);
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllRead(User user) {
        List<Notification> unread = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().filter(n -> !n.isRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public Map<String, Long> getUnreadCount(User user) {
        return Map.of("count", notificationRepository.countByUserAndReadFalse(user));
    }
}
