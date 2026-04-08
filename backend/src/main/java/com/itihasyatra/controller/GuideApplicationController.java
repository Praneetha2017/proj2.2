package com.itihasyatra.controller;

import com.itihasyatra.model.GuideApplication;
import com.itihasyatra.model.User;
import com.itihasyatra.repository.GuideApplicationRepository;
import com.itihasyatra.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/guide-applications")
@CrossOrigin(origins = "http://localhost:5173")
public class GuideApplicationController {
    private final GuideApplicationRepository guideApplicationRepository;
    private final UserRepository userRepository;

    public GuideApplicationController(GuideApplicationRepository guideApplicationRepository, UserRepository userRepository) {
        this.guideApplicationRepository = guideApplicationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@Valid @RequestBody GuideApplicationRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found for this email."));
        }

        GuideApplication application = new GuideApplication();
        application.setUser(user.get());
        application.setName(request.getName());
        application.setEmail(request.getEmail());
        application.setLanguages(request.getLanguages());
        application.setExperience(request.getExperience());
        application.setDescription(request.getDescription());
        application.setProofName(request.getProofName());
        application.setProofData(request.getProofData());
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(GuideApplication.Status.PENDING);

        guideApplicationRepository.save(application);
        return ResponseEntity.ok(Map.of("message", "Guide application submitted successfully."));
    }

    @GetMapping("/pending")
    public List<GuideApplication> getPendingApplications() {
        return guideApplicationRepository.findByStatus(GuideApplication.Status.PENDING);
    }

    @GetMapping("/user/{userId}")
    public List<GuideApplication> getByUser(@PathVariable Long userId) {
        return guideApplicationRepository.findByUserId(userId);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody ApprovalRequest approvalRequest) {
        return guideApplicationRepository.findById(id)
                .map(application -> {
                    application.setStatus(GuideApplication.Status.APPROVED);
                    application.setApprovalEmail(approvalRequest.getApprovalEmail());
                    application.setApprovalDate(LocalDateTime.now());
                    guideApplicationRepository.save(application);
                    return ResponseEntity.ok(Map.of("message", "Guide application approved."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return guideApplicationRepository.findById(id)
                .map(application -> {
                    application.setStatus(GuideApplication.Status.REJECTED);
                    guideApplicationRepository.save(application);
                    return ResponseEntity.ok(Map.of("message", "Guide application rejected."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    static class GuideApplicationRequest {
        private String name;
        private String email;
        private String languages;
        private String experience;
        private String description;
        private String proofName;
        private byte[] proofData;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getLanguages() {
            return languages;
        }

        public void setLanguages(String languages) {
            this.languages = languages;
        }

        public String getExperience() {
            return experience;
        }

        public void setExperience(String experience) {
            this.experience = experience;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getProofName() {
            return proofName;
        }

        public void setProofName(String proofName) {
            this.proofName = proofName;
        }

        public byte[] getProofData() {
            return proofData;
        }

        public void setProofData(byte[] proofData) {
            this.proofData = proofData;
        }
    }

    static class ApprovalRequest {
        private String approvalEmail;

        public String getApprovalEmail() {
            return approvalEmail;
        }

        public void setApprovalEmail(String approvalEmail) {
            this.approvalEmail = approvalEmail;
        }
    }
}
