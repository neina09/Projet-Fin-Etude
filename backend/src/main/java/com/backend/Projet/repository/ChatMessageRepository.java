package com.backend.Projet.repository;

import com.backend.Projet.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("""
        SELECT m FROM ChatMessage m
        WHERE (m.sender.id = :user1 AND m.recipient.id = :user2)
           OR (m.sender.id = :user2 AND m.recipient.id = :user1)
        ORDER BY m.timestamp ASC
    """)
    List<ChatMessage> findConversation(Long user1, Long user2);
}
