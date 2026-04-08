package com.itihasyatra.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "is_verified", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isVerified = false;

    private String languages;
    private String experience;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        ADMIN, CULTURAL_ENTHUSIAST, CONTENT_CREATOR, TOUR_GUIDE
    }
}