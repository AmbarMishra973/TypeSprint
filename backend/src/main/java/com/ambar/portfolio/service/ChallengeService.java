package com.ambar.portfolio.service;

import com.ambar.portfolio.model.Challenge;
import com.ambar.portfolio.repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    // ⚔️ Send a new challenge
    public Challenge createChallenge(String sender, String receiver, int duration) {
        Challenge challenge = new Challenge(sender, receiver, duration);
        return challengeRepository.save(challenge);
    }

    // 📬 Get pending challenges for a user
    public List<Challenge> getPendingChallenges(String username) {
        return challengeRepository.findByReceiverNameAndStatus(username, "PENDING");
    }

    // ✅ Accept or ❌ Decline a challenge
    public Challenge updateChallengeStatus(Long challengeId, String status) {
        Challenge challenge = challengeRepository.findById(challengeId).orElse(null);
        if (challenge != null) {
            challenge.setStatus(status); // "ACCEPTED" or "DECLINED"
            return challengeRepository.save(challenge);
        }
        return null;
    }
}