package com.itihasyatra.controller;

import com.itihasyatra.model.Content;
import com.itihasyatra.model.User;
import com.itihasyatra.repository.ContentRepository;
import com.itihasyatra.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/creator")
@CrossOrigin(origins = "http://localhost:5173")
public class CreatorController {
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    public CreatorController(ContentRepository contentRepository, UserRepository userRepository) {
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/content/add")
    public ResponseEntity<?> addContent(@Valid @RequestBody ContentRequest contentRequest,
                                        @RequestHeader(value = "Authorization", required = false) String authorization) {
        Content content = new Content();
        content.setName(contentRequest.getName());
        content.setDescription(contentRequest.getDescription());
        content.setState(contentRequest.getTargetState());
        content.setUrl(contentRequest.getUrl());
        content.setCreatedAt(LocalDateTime.now());
        content.setStatus(Content.Status.PENDING);

        if (contentRequest.getCategory() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Content category is required."));
        }

        switch (contentRequest.getCategory().toLowerCase()) {
            case "monument":
            case "spot":
                content.setType(Content.Type.SPOT);
                break;
            case "art":
            case "art & craft":
            case "handicraft":
                content.setType(Content.Type.ART);
                break;
            case "cuisine":
            case "food":
                content.setType(Content.Type.CUISINE);
                break;
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid category type."));
        }

        content.setCreatedBy("creator");
        contentRepository.save(content);
        return ResponseEntity.ok(Map.of("message", "Content submitted for admin review."));
    }

    static class ContentRequest {
        private String category;
        private String targetState;
        private String name;
        private String description;
        private String url;

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getTargetState() {
            return targetState;
        }

        public void setTargetState(String targetState) {
            this.targetState = targetState;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}
