package com.itihasyatra.controller;

import com.itihasyatra.model.Content;
import com.itihasyatra.repository.ContentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "http://localhost:5173")
public class ContentController {
    private final ContentRepository contentRepository;

    public ContentController(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<Content>> getApprovedContentByState(@PathVariable String state) {
        List<Content> approved = contentRepository.findByStateAndStatus(state, Content.Status.APPROVED);
        return ResponseEntity.ok(approved);
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Content>> getAllApprovedContent() {
        List<Content> approved = contentRepository.findByStatus(Content.Status.APPROVED);
        return ResponseEntity.ok(approved);
    }
}
