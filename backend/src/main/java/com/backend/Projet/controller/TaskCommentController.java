package com.backend.Projet.controller;

import com.backend.Projet.dto.TaskCommentResponseDto;
import com.backend.Projet.model.User;
import com.backend.Projet.service.TaskCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskCommentController {

    private final TaskCommentService taskCommentService;

    @GetMapping("/{taskId}/comments")
    public ResponseEntity<List<TaskCommentResponseDto>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskCommentService.getComments(taskId));
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<TaskCommentResponseDto> addComment(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User user) {
        
        String content = payload.get("content");
        return ResponseEntity.ok(taskCommentService.addComment(taskId, content, user));
    }
}
