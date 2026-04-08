package com.itihasyatra.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "guide_applications")
@Data
public class GuideApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String languages;
    private String experience;

    @Column(length = 1000)
    private String description;

    private String proofName;

    @Lob
    @Column(name = "proof_data", columnDefinition = "LONGBLOB")
    private byte[] proofData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    private String approvalEmail;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt = LocalDateTime.now();

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}