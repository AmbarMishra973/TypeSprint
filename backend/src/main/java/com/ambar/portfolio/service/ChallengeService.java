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
// 🌍 Matchmaking: Find a human opponent or fallback to a bot
    public Challenge joinMatchmaking(String username) {
        // Look for any waiting open challenge or player in the queue
        // (Assuming you have a repository or list tracking active players looking for a match)
        Challenge waitingChallenge = findWaitingPlayerInQueue(username);

        if (waitingChallenge != null) {
            // Found a real human player! Update or accept the match.
            waitingChallenge.setStatus("ACCEPTED");
            waitingChallenge.setWordsText(generateSharedWords());
            return challengeRepository.save(waitingChallenge);
        } else {
            // 🤖 NO HUMAN FOUND? SPAWN A TYPING BOT!
            Challenge botChallenge = new Challenge(username, "Bot_Typist", 30);
            botChallenge.setStatus("ACCEPTED");
            botChallenge.setWordsText(generateSharedWords());
            botChallenge.setReceiverWpm(55); // Give the bot a default WPM score
            return challengeRepository.save(botChallenge);
        }
    }

    // 🔍 Helper method to find a waiting player in the queue
    private Challenge findWaitingPlayerInQueue(String currentUsername) {
        // Search your database for a challenge that is PENDING and doesn't belong to the current user
        try {
            java.util.List<Challenge> pendingList = challengeRepository.findByStatus("PENDING");
            for (Challenge c : pendingList) {
                if (c.getSenderName() != null && !c.getSenderName().equals(currentUsername)) {
                    return c;
                }
            }
        } catch (Exception e) {
            // Fallback if repository query needs adjustment
        }
        return null;
    }
    // 🛑 Leave the matchmaking queue
    public void leaveMatchmaking(String username) {
        matchmakingQueue.remove(username);
    }

    // ⚔️ Send a new challenge
    public Challenge createChallenge(String sender, String receiver, int duration) {
        Challenge challenge = new Challenge(sender, receiver, duration);
        challenge.setWordsText(generateSharedWords());
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
    // 🔍 Find ONLY fresh active matches, and auto-delete stale ones
    public Challenge getActiveMatch(String username) {
        long fiveMinutesAgo = System.currentTimeMillis() - (5 * 60 * 1000);

        // Check challenges sent by this user
        List<Challenge> asSender = challengeRepository.findBySenderNameAndStatus(username, "ACCEPTED");
        for (Challenge c : asSender) {
            if (c.getWinnerName() == null) {
                if (c.getCreatedAt() < fiveMinutesAgo) {
                    c.setStatus("CANCELLED"); // 🧹 Clean up stale match
                    challengeRepository.save(c);
                } else {
                    return c; // 🚀 Return fresh match!
                }
            }
        }

        // Check challenges received by this user
        List<Challenge> asReceiver = challengeRepository.findByReceiverNameAndStatus(username, "ACCEPTED");
        for (Challenge c : asReceiver) {
            if (c.getWinnerName() == null) {
                if (c.getCreatedAt() < fiveMinutesAgo) {
                    c.setStatus("CANCELLED"); // 🧹 Clean up stale match
                    challengeRepository.save(c);
                } else {
                    return c; // 🚀 Return fresh match!
                }
            }
        }

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

    // 📝 Generate universal shared words for multiplayer matches
    private String generateSharedWords() {
        String[] words = {"the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"};
        StringBuilder sb = new StringBuilder();
        java.util.Random r = new java.util.Random();
        for(int i = 0; i < 100; i++) {
            sb.append(words[r.nextInt(words.length)]).append(" ");
        }
        return sb.toString().trim();
    }
}