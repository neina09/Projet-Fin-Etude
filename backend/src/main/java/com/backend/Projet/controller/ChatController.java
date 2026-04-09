package com.backend.Projet.controller;

import com.backend.Projet.dto.ChatRequestDto;
import com.backend.Projet.dto.ChatResponseDto;
import com.backend.Projet.model.User;
import com.backend.Projet.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatResponseDto> sendMessage(
            @Valid @RequestBody ChatRequestDto input,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(chatService.sendMessage(input, currentUser));
    }

    @GetMapping("/history/{otherUserId}")
    public ResponseEntity<List<ChatResponseDto>> getChatHistory(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(chatService.getConversation(otherUserId, currentUser));
    }
}
