package com.itihasyatra.repository;

import com.itihasyatra.model.TripRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRequestRepository extends JpaRepository<TripRequest, Long> {
    List<TripRequest> findByStatus(TripRequest.Status status);
    List<TripRequest> findByUserId(Long userId);
    List<TripRequest> findByGuideId(Long guideId);
    List<TripRequest> findByStateAndStatus(String state, TripRequest.Status status);
}