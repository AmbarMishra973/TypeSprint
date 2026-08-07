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
    // 🏁 Submit Score & Determine Winner
    public Challenge submitChallengeScore(Long challengeId, String username, int wpm) {
        Challenge challenge = challengeRepository.findById(challengeId).orElse(null);
        if (challenge != null) {
            // Save the score for the correct player
            if (challenge.getSenderName().equals(username)) {
                challenge.setSenderWpm(wpm);
            } else if (challenge.getReceiverName().equals(username)) {
                challenge.setReceiverWpm(wpm);
            }

            // If both players have now submitted their scores, finish the match!
            if (challenge.getSenderWpm() > 0 && challenge.getReceiverWpm() > 0) {
                challenge.setStatus("COMPLETED");
                if (challenge.getSenderWpm() > challenge.getReceiverWpm()) {
                    challenge.setWinnerName(challenge.getSenderName());
                } else if (challenge.getReceiverWpm() > challenge.getSenderWpm()) {
                    challenge.setWinnerName(challenge.getReceiverName());
                } else {
                    challenge.setWinnerName("TIE");
                }
            }
            return challengeRepository.save(challenge);
        }
        return null;
    }
}