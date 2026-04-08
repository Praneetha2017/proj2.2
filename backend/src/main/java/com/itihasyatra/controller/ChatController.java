package com.itihasyatra.controller;

import com.itihasyatra.model.ChatMessage;
import com.itihasyatra.model.TripRequest;
import com.itihasyatra.repository.ChatMessageRepository;
import com.itihasyatra.repository.TripRequestRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
    private final ChatMessageRepository chatMessageRepository;
    private final TripRequestRepository tripRequestRepository;

    public ChatController(ChatMessageRepository chatMessageRepository, TripRequestRepository tripRequestRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.tripRequestRepository = tripRequestRepository;
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<?> getMessages(@PathVariable Long tripId) {
        Optional<TripRequest> trip = tripRequestRepository.findById(tripId);
        if (trip.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found."));
        }
        return ResponseEntity.ok(chatMessageRepository.findByTripIdOrderByMessageTimeAsc(tripId));
    }

    @PostMapping("/{tripId}/message")
    public ResponseEntity<?> sendMessage(@PathVariable Long tripId, @Valid @RequestBody ChatMessageRequest request) {
        Optional<TripRequest> trip = tripRequestRepository.findById(tripId);
        if (trip.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found."));
        }

        ChatMessage message = new ChatMessage();
        message.setTrip(trip.get());
        message.setSenderName(request.getSenderName());
        message.setMessage(request.getMessage());
        message.setMessageTime(LocalDateTime.now());

        chatMessageRepository.save(message);
        return ResponseEntity.ok(Map.of("message", "Chat message saved."));
    }

    static class ChatMessageRequest {
        private String senderName;
        private String message;

        public String getSenderName() {
            return senderName;
        }

        public void setSenderName(String senderName) {
            this.senderName = senderName;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
