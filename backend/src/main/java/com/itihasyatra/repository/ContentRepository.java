package com.itihasyatra.repository;

import com.itihasyatra.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByStatus(Content.Status status);
    List<Content> findByCreatorId(Long creatorId);
    List<Content> findByStateAndStatus(String state, Content.Status status);
    List<Content> findByTypeAndStateAndStatus(Content.Type type, String state, Content.Status status);
}