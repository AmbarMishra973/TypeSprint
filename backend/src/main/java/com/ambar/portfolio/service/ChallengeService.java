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
    // 🚦 Matchmaking Queue
    private final java.util.concurrent.ConcurrentLinkedQueue<String> matchmakingQueue = new java.util.concurrent.ConcurrentLinkedQueue<>();

    // 🎲 Attempt to find a random match
    public Challenge joinMatchmaking(String username) {
        // Prevent duplicate queueing
        if (matchmakingQueue.contains(username)) {
            return null; // Already waiting
        }

        String opponent = matchmakingQueue.poll(); // Grab the first person waiting

        if (opponent != null && !opponent.equals(username)) {
            // We found someone! Create an instant 30-second match
            Challenge challenge = new Challenge(opponent, username, 30);
            challenge.setStatus("ACCEPTED"); // Auto-accept the match!
            // challenge.setWordsText("Optional: You can generate seed words here");
            return challengeRepository.save(challenge);
        } else {
            // Nobody is waiting, so we enter the queue
            matchmakingQueue.add(username);
            return null; 
        }
    }

    // 🛑 Leave the matchmaking queue
    public void leaveMatchmaking(String username) {
        matchmakingQueue.remove(username);
    }

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
    // 🔍 Find if user has a game about to start
    // 🔍 Find ONLY active matches that haven't been completed yet
    public Challenge getActiveMatch(String username) {
        List<Challenge> asSender = challengeRepository.findBySenderNameAndStatus(username, "ACCEPTED");
        if (!asSender.isEmpty() && asSender.get(0).getWinnerName() == null) return asSender.get(0);

        List<Challenge> asReceiver = challengeRepository.findByReceiverNameAndStatus(username, "ACCEPTED");
        if (!asReceiver.isEmpty() && asReceiver.get(0).getWinnerName() == null) return asReceiver.get(0);

        return null;
    }

    // 📊 Update live typing position during a match
    public void updateProgress(Long challengeId, String username, int position) {
        Challenge c = challengeRepository.findById(challengeId).orElse(null);
        if (c != null) {
            // We can store temporary progress or piggyback on WPM field updates
            // Let's create a quick helper or use existing fields if needed, 
            // or better yet, fetch progress via a lightweight endpoint.
        }
    }

    // 🔍 Get a specific challenge by ID
    public Challenge getChallengeById(Long challengeId) {
        return challengeRepository.findById(challengeId).orElse(null);
    }

    // 📊 Calculate total wins, losses, and win rate for a user
    public java.util.Map<String, Object> getUserDuelStats(String username) {
        List<Challenge> matches = challengeRepository.findBySenderNameOrReceiverName(username, username);
        
        int wins = 0, losses = 0, ties = 0, total = 0;
        
        for (Challenge c : matches) {
            if ("COMPLETED".equals(c.getStatus())) {
                total++;
                if (username.equals(c.getWinnerName())) {
                    wins++;
                } else if ("TIE".equals(c.getWinnerName())) {
                    ties++;
                } else {
                    losses++;
                }
            }
        }
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalMatches", total);
        stats.put("wins", wins);
        stats.put("losses", losses);
        stats.put("ties", ties);
        stats.put("winRate", total > 0 ? (wins * 100 / total) : 0);
        
        return stats;
    }
}