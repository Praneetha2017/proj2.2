package com.itihasyatra.repository;

import com.itihasyatra.model.GuideApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideApplicationRepository extends JpaRepository<GuideApplication, Long> {
    List<GuideApplication> findByStatus(GuideApplication.Status status);
    List<GuideApplication> findByUserId(Long userId);
    boolean existsByApprovalEmail(String approvalEmail);
}