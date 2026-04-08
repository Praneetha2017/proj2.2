package com.itihasyatra.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private TripRequest trip;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(name = "message_time", nullable = false)
    private LocalDateTime messageTime = LocalDateTime.now();
}