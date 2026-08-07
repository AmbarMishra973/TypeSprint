package com.ambar.portfolio.repository;

import com.ambar.portfolio.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    // Find all pending challenges for a specific user (Their Challenge Inbox)
    List<Challenge> findByReceiverNameAndStatus(String receiverName, String status);
    
    // Find all active or past matches for a user
    List<Challenge> findBySenderNameOrReceiverName(String senderName, String receiverName);
}