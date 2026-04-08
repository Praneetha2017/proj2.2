package com.itihasyatra.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_requests")
@Data
public class TripRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String state;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "num_people", nullable = false)
    private Integer numPeople;

    @Column(name = "guide_needed", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean guideNeeded = false;

    @ManyToOne
    @JoinColumn(name = "guide_id")
    private User guide;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, ASSIGNED, COMPLETED, CANCELLED
    }
}