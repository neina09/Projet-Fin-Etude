package com.backend.Projet.service;

import com.backend.Projet.dto.ChatRequestDto;
import com.backend.Projet.dto.ChatResponseDto;
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
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository         userRepository;
    private final BookingRepository      bookingRepository;
    private final OfferRepository        offerRepository;
    private final com.backend.Projet.mapper.ChatMapper chatMapper;


    @Transactional
    public ChatResponseDto sendMessage(ChatRequestDto input, User sender) {
        User recipient = userRepository.findById(input.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        // لا يمكن إرسال رسالة لنفسك
        if (sender.getId().equals(recipient.getId())) {
            throw new BusinessException("Cannot send a message to yourself");
        }

        boolean canChat = checkChatPermission(sender.getId(), recipient.getId());
        if (!canChat) {
            throw new BusinessException("Chat is locked until a task or booking is accepted between you.");
        }

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .recipient(recipient)
                .content(input.getContent())
                .build();

        return chatMapper.toDto(chatMessageRepository.saveAndFlush(message));
    }

    @Transactional(readOnly = true)
    public List<ChatResponseDto> getConversation(Long otherUserId, User currentUser) {
        // تأكد أن المستخدم الآخر موجود
        userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return chatMessageRepository.findConversation(currentUser.getId(), otherUserId)
                .stream().map(chatMapper::toDto).toList();
    }

    // FIX: checkChatPermission — كان غير متماثل (asymmetric)، الآن يتحقق في الاتجاهين بشكل صحيح
    private boolean checkChatPermission(Long user1, Long user2) {

        // 1. هل هناك Booking مقبول بين الاثنين في أي اتجاه؟
        boolean hasBooking =
                // user1 هو العميل و user2 هو العامل
                bookingRepository.findByUserIdAndStatus(user1, BookingStatus.ACCEPTED)
                        .stream().anyMatch(b -> b.getWorker().getUser().getId().equals(user2))
                        ||
                        // user2 هو العميل و user1 هو العامل
                        bookingRepository.findByUserIdAndStatus(user2, BookingStatus.ACCEPTED)
                                .stream().anyMatch(b -> b.getWorker().getUser().getId().equals(user1));

        if (hasBooking) return true;

        // 2. هل هناك Task قيد التنفيذ بين الاثنين في أي اتجاه؟
        boolean hasTask =
                // user1 هو العامل و user2 هو صاحب الـ Task
                offerRepository.findByWorkerUserId(user1).stream()
                        .anyMatch(o -> o.getStatus() == OfferStatus.IN_PROGRESS
                                && o.getTask().getUser().getId().equals(user2))
                        ||
                        // user2 هو العامل و user1 هو صاحب الـ Task
                        offerRepository.findByWorkerUserId(user2).stream()
                                .anyMatch(o -> o.getStatus() == OfferStatus.IN_PROGRESS
                                        && o.getTask().getUser().getId().equals(user1));

        return hasTask;
    }
}
