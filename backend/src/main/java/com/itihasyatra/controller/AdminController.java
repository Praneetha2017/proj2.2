package com.itihasyatra.controller;

import com.itihasyatra.model.Content;
import com.itihasyatra.model.User;
import com.itihasyatra.repository.ContentRepository;
import com.itihasyatra.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    public AdminController(ContentRepository contentRepository, UserRepository userRepository) {
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/content/pending")
    public List<Content> getPendingContent() {
        return contentRepository.findByStatus(Content.Status.PENDING);
    }

    @PutMapping("/content/{id}/approve")
    public ResponseEntity<?> approveContent(@PathVariable Long id) {
        return contentRepository.findById(id)
                .map(content -> {
                    content.setStatus(Content.Status.APPROVED);
                    contentRepository.save(content);
                    return ResponseEntity.ok(Map.of("message", "Content approved."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/content/{id}/reject")
    public ResponseEntity<?> rejectContent(@PathVariable Long id) {
        return contentRepository.findById(id)
                .map(content -> {
                    content.setStatus(Content.Status.REJECTED);
                    contentRepository.save(content);
                    return ResponseEntity.ok(Map.of("message", "Content rejected."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/content/approved/{state}")
    public List<Content> getApprovedContentByState(@PathVariable String state) {
        return contentRepository.findByStateAndStatus(state, Content.Status.APPROVED);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
