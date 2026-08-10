package com.ambar.portfolio.controller;

import com.ambar.portfolio.model.Challenge;
import com.ambar.portfolio.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    // In-memory live positions: Map<ChallengeId, Map<Username, CharacterIndex>>
    private final Map<Long, Map<String, Integer>> livePositions = new ConcurrentHashMap<>();

    // ⚔️ Send a Challenge
    @PostMapping("/send")
    public ResponseEntity<?> sendChallenge(
            @RequestParam String sender, 
            @RequestParam String receiver, 
            @RequestParam int duration,
            @RequestParam(required = false) String wordsText) {
        
        Challenge challenge = challengeService.createChallenge(sender, receiver, duration);
        if (wordsText != null && !wordsText.isEmpty()) {
            challenge.setWordsText(wordsText);
        }
        return ResponseEntity.ok(challenge);
    }

    // 📬 Get Challenge Inbox
    @GetMapping("/{username}/pending")
    public ResponseEntity<List<Challenge>> getPendingChallenges(@PathVariable String username) {
        return ResponseEntity.ok(challengeService.getPendingChallenges(username));
    }

    // 🔍 Check for Active Match
    @GetMapping("/{username}/active")
    public ResponseEntity<?> getActiveChallenge(@PathVariable String username) {
        Challenge active = challengeService.getActiveMatch(username);
        if (active != null) {
            return ResponseEntity.ok(active);
        }
        return ResponseEntity.noContent().build();
    }

    // ✅/❌ Update Status (Accept/Decline)
    @PutMapping("/{challengeId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long challengeId, @RequestParam String status) {
        Challenge updatedChallenge = challengeService.updateChallengeStatus(challengeId, status);
        if (updatedChallenge == null) {
            return ResponseEntity.status(404).body("Challenge not found");
        }
        return ResponseEntity.ok(updatedChallenge);
    }

    // 🏁 Submit Score Endpoint
    @PostMapping("/{challengeId}/submit")
    public ResponseEntity<?> submitScore(
            @PathVariable Long challengeId, 
            @RequestParam String username, 
            @RequestParam int wpm) {
        
        Challenge updatedChallenge = challengeService.submitChallengeScore(challengeId, username, wpm);
        if (updatedChallenge == null) {
            return ResponseEntity.status(404).body("Challenge not found");
        }
        return ResponseEntity.ok(updatedChallenge);
    }

    // 📊 Live Position Tracking for Opponent Ghost Cursor
    @PostMapping("/{challengeId}/progress")
    public ResponseEntity<?> updateProgress(
            @PathVariable Long challengeId, 
            @RequestParam String username, 
            @RequestParam int position) {
        
        livePositions.computeIfAbsent(challengeId, k -> new ConcurrentHashMap<>()).put(username, position);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{challengeId}/progress")
    public ResponseEntity<Map<String, Integer>> getProgress(@PathVariable Long challengeId) {
        return ResponseEntity.ok(livePositions.getOrDefault(challengeId, Collections.emptyMap()));
    }

    // 🔍 Fetch specific challenge details (used to check if match is COMPLETED)
    @GetMapping("/{challengeId}")
    public ResponseEntity<Challenge> getChallengeById(@PathVariable Long challengeId) {
        Challenge challenge = challengeService.getChallengeById(challengeId);
        if (challenge != null) {
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.notFound().build();
    }

    // 📊 Get Duel Statistics for Profile
    @GetMapping("/{username}/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable String username) {
        return ResponseEntity.ok(challengeService.getUserDuelStats(username));
    }

    // 🎲 Join Global Matchmaking Queue
    @PostMapping("/matchmake/join")
    public ResponseEntity<?> joinQueue(@RequestParam String username) {
        Challenge match = challengeService.joinMatchmaking(username);
        if (match != null) {
            return ResponseEntity.ok(match); // Instantly matched!
        }
        return ResponseEntity.accepted().body("Waiting for opponent..."); // Placed in queue
    }

    // 🛑 Leave Global Matchmaking Queue
    @PostMapping("/matchmake/leave")
    public ResponseEntity<?> leaveQueue(@RequestParam String username) {
        challengeService.leaveMatchmaking(username);
        return ResponseEntity.ok("Left queue");
    }

    @Autowired
    private DailyChallengeService dailyChallengeService;

    @GetMapping("/daily-text")
    public ResponseEntity<String> getDailyText() {
        return ResponseEntity.ok(dailyChallengeService.getDailyText());
    }
}