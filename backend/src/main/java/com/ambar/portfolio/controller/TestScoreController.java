package com.ambar.portfolio.controller;

import com.ambar.portfolio.dto.ScoreRequest;
import com.ambar.portfolio.model.TestScore;
import com.ambar.portfolio.service.TestScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestScoreController {

    @Autowired
    private TestScoreService testScoreService;

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(
            @RequestParam String mode,
            @RequestParam(required = false) Integer timeLimit,
            @RequestParam(required = false) Integer wordLimit,
            @RequestParam Boolean punctuation,
            @RequestParam Boolean numbers,
            @RequestParam(defaultValue = "global") String scope,
            @RequestParam(defaultValue = "all") String timeRange) {

        // 1. Friends scope placeholder
        if ("friends".equalsIgnoreCase(scope)) {
            return ResponseEntity.ok(List.of());
        }

        // 2. Calculate timestamp for time filters
        long now = System.currentTimeMillis();
        long sinceTimestamp = 0L;

        if ("week".equalsIgnoreCase(timeRange)) {
            sinceTimestamp = now - (7L * 24 * 60 * 60 * 1000);
        } else if ("month".equalsIgnoreCase(timeRange)) {
            sinceTimestamp = now - (30L * 24 * 60 * 60 * 1000);
        }

        // 3. Call the service layer (passing all 6 parameters)
        List<TestScore> leaders = testScoreService.getLeaderboard(
                mode, timeLimit, wordLimit, punctuation, numbers, sinceTimestamp
        );

        return ResponseEntity.ok(leaders);
    }
    @PostMapping("/save")
public ResponseEntity<?> saveTestScore(@RequestBody ScoreRequest request) {
    TestScore savedScore = testScoreService.saveScore(request);
    if (savedScore == null) {
        return ResponseEntity.status(400).body("User not found or failed to save score");
    }
    return ResponseEntity.ok(savedScore);
}
}