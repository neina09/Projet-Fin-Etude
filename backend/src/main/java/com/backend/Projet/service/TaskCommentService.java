package com.backend.Projet.service;

import com.backend.Projet.dto.TaskCommentRequestDto;
import com.backend.Projet.dto.TaskCommentResponseDto;
import com.backend.Projet.exception.BusinessException;
import com.backend.Projet.exception.ResourceNotFoundException;
import com.backend.Projet.model.*;
import com.backend.Projet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository        taskRepository;
    private final WorkerRepository      workerRepository;
    private final OfferRepository       offerRepository;

    public List<TaskCommentResponseDto> getComments(Long taskId) {
        // تأكد أن الـ Task موجودة
        taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        return taskCommentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
                .stream()
                .map(c -> TaskCommentResponseDto.builder()
                        .id(c.getId())
                        .content(c.getContent())
                        .authorName(c.getAuthorName())
                        .createdAt(c.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional
    public TaskCommentResponseDto addComment(Long taskId, String content, User user) {
        // 1. تأكد أن الـ Task موجودة
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // 2. تأكد أن المستخدم عامل
        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BusinessException("Only workers can comment on tasks"));

        // FIX: تأكد أن العامل قدّم عرضاً على هذه الـ Task
        boolean hasOffer = offerRepository.existsByTaskIdAndWorkerId(taskId, worker.getId());
        if (!hasOffer) {
            throw new BusinessException("You must submit an offer on this task before commenting");
        }

        TaskComment comment = TaskComment.builder()
                .task(task)
                .user(user)
                .content(content)
                .authorName(user.getName())
                .build();

        TaskComment saved = taskCommentRepository.save(comment);

        return TaskCommentResponseDto.builder()
                .id(saved.getId())
                .content(saved.getContent())
                .authorName(saved.getAuthorName())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}