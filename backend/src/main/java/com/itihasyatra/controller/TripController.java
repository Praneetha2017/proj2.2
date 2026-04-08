package com.itihasyatra.controller;

import com.itihasyatra.model.TripRequest;
import com.itihasyatra.model.User;
import com.itihasyatra.repository.TripRequestRepository;
import com.itihasyatra.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173")
public class TripController {
    private final TripRequestRepository tripRequestRepository;
    private final UserRepository userRepository;

    public TripController(TripRequestRepository tripRequestRepository, UserRepository userRepository) {
        this.tripRequestRepository = tripRequestRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestTrip(@Valid @RequestBody TripRequestPayload payload) {
        Optional<User> user = userRepository.findById(payload.getUserId());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Requesting user not found."));
        }

        TripRequest tripRequest = new TripRequest();
        tripRequest.setUser(user.get());
        tripRequest.setUserName(user.get().getUsername());
        tripRequest.setEmail(user.get().getEmail());
        tripRequest.setState(payload.getState());
        tripRequest.setStartDate(payload.getStartDate());
        tripRequest.setEndDate(payload.getEndDate());
        tripRequest.setNumPeople(payload.getNumPeople());
        tripRequest.setGuideNeeded(payload.getGuideNeeded());
        tripRequest.setStatus(TripRequest.Status.PENDING);
        tripRequest.setCreatedAt(LocalDateTime.now());

        tripRequestRepository.save(tripRequest);
        return ResponseEntity.ok(Map.of("message", "Trip request submitted successfully."));
    }

    @GetMapping("/user/{userId}")
    public List<TripRequest> getByUser(@PathVariable Long userId) {
        return tripRequestRepository.findByUserId(userId);
    }

    @GetMapping("/guide/{guideId}")
    public List<TripRequest> getByGuide(@PathVariable Long guideId) {
        return tripRequestRepository.findByGuideId(guideId);
    }

    @GetMapping("/state/{state}")
    public List<TripRequest> getByState(@PathVariable String state) {
        return tripRequestRepository.findByStateAndStatus(state, TripRequest.Status.PENDING);
    }

    @PutMapping("/{id}/assign-guide")
    public ResponseEntity<?> assignGuide(@PathVariable Long id, @RequestBody AssignGuideRequest request) {
        Optional<TripRequest> tripOpt = tripRequestRepository.findById(id);
        Optional<User> guideOpt = userRepository.findById(request.getGuideId());

        if (tripOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip request not found."));
        }
        if (guideOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Guide user not found."));
        }

        TripRequest trip = tripOpt.get();
        trip.setGuide(guideOpt.get());
        trip.setStatus(TripRequest.Status.ASSIGNED);
        tripRequestRepository.save(trip);

        return ResponseEntity.ok(Map.of("message", "Guide successfully assigned to trip."));
    }

    static class TripRequestPayload {
        private Long userId;
        private String state;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer numPeople;
        private Boolean guideNeeded;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public Integer getNumPeople() {
            return numPeople;
        }

        public void setNumPeople(Integer numPeople) {
            this.numPeople = numPeople;
        }

        public Boolean getGuideNeeded() {
            return guideNeeded;
        }

        public void setGuideNeeded(Boolean guideNeeded) {
            this.guideNeeded = guideNeeded;
        }
    }

    static class AssignGuideRequest {
        private Long guideId;

        public Long getGuideId() {
            return guideId;
        }

        public void setGuideId(Long guideId) {
            this.guideId = guideId;
        }
    }
}
