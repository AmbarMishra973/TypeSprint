package com.ambar.portfolio.repository;

import com.ambar.portfolio.model.Challenge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    // Find pending challenges for the inbox
    List<Challenge> findByReceiverNameAndStatus(String receiverName, String status);

    // Find challenges sent by a user with a specific status (e.g. ACCEPTED)
    List<Challenge> findBySenderNameAndStatus(String senderName, String status);

    // Find all active or past matches for a user
    List<Challenge> findBySenderNameOrReceiverName(
            String senderName,
            String receiverName
    );
}