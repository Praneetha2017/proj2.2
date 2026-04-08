package com.itihasyatra.controller;

import com.itihasyatra.model.User;
import com.itihasyatra.repository.GuideApplicationRepository;
import com.itihasyatra.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserRepository userRepository;
    private final GuideApplicationRepository guideApplicationRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, GuideApplicationRepository guideApplicationRepository) {
        this.userRepository = userRepository;
        this.guideApplicationRepository = guideApplicationRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered."));
        }
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already taken."));
        }

        if (signupRequest.getRole() == User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Admin signup is not allowed through the frontend."));
        }

        if (signupRequest.getRole() == User.Role.TOUR_GUIDE) {
            boolean approvedEmail = guideApplicationRepository.existsByApprovalEmail(signupRequest.getEmail());
            if (!approvedEmail) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Invalid access: Tour Guide signup requires an admin-approved guide email."));
            }
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(signupRequest.getRole());
        user.setVerified(signupRequest.getRole() != User.Role.CONTENT_CREATOR);
        user.setLanguages(signupRequest.getLanguages());
        user.setExperience(signupRequest.getExperience());
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Signup successful.", "user", user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        if ("admin@itihasyatra.com".equals(loginRequest.getEmail()) && "Admin@1234".equals(loginRequest.getPassword())) {
            Map<String, String> adminResponse = new HashMap<>();
            adminResponse.put("message", "Admin login successful.");
            adminResponse.put("email", loginRequest.getEmail());
            adminResponse.put("role", User.Role.ADMIN.name());
            adminResponse.put("token", "admin-token-placeholder");
            return ResponseEntity.ok(adminResponse);
        }

        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials."));
                    }
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Login successful.");
                    response.put("email", user.getEmail());
                    response.put("role", user.getRole());
                    response.put("isVerified", user.getVerified());
                    response.put("username", user.getUsername());
                    response.put("token", java.util.UUID.randomUUID().toString());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found.")));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification token."));
        }
        return ResponseEntity.ok(Map.of("message", "Email successfully verified."));
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private User.Role role;
        private String languages;
        private String experience;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public User.Role getRole() {
            return role;
        }

        public void setRole(User.Role role) {
            this.role = role;
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
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
