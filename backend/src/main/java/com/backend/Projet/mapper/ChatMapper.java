package com.backend.Projet.mapper;

import com.backend.Projet.dto.ChatResponseDto;
import com.backend.Projet.model.ChatMessage;
import org.springframework.stereotype.Component;

@Component
public class ChatMapper {

    public ChatResponseDto toDto(ChatMessage message) {
        if (message == null) {
            return null;
        }
        return ChatResponseDto.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .recipientId(message.getRecipient().getId())
                .recipientName(message.getRecipient().getName())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}
