package com.ambar.portfolio.controller;

import com.ambar.portfolio.model.Challenge;
import com.ambar.portfolio.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    // ⚔️ Send a Challenge
    @PostMapping("/send")
    public ResponseEntity<?> sendChallenge(@RequestParam String sender, @RequestParam String receiver, @RequestParam int duration) {
        Challenge challenge = challengeService.createChallenge(sender, receiver, duration);
        return ResponseEntity.ok(challenge);
    }

    // 📬 Get Challenge Inbox
    @GetMapping("/{username}/pending")
    public ResponseEntity<List<Challenge>> getPendingChallenges(@PathVariable String username) {
        return ResponseEntity.ok(challengeService.getPendingChallenges(username));
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
    public ResponseEntity<?> submitScore(@PathVariable Long challengeId, @RequestParam String username, @RequestParam int wpm) {
        Challenge updatedChallenge = challengeService.submitChallengeScore(challengeId, username, wpm);
        if (updatedChallenge == null) {
            return ResponseEntity.status(404).body("Challenge not found");
        }
        return ResponseEntity.ok(updatedChallenge);
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
}