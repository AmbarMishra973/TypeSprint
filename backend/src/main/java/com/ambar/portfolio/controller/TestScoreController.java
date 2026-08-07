package com.ambar.portfolio.controller;

import com.ambar.portfolio.dto.ScoreRequest;
import com.ambar.portfolio.model.TestScore;
import com.ambar.portfolio.service.TestScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestScoreController {

    private final TestScoreService testScoreService;

    public TestScoreController(TestScoreService testScoreService) {
        this.testScoreService = testScoreService;
    }

    // 🚀 POST: Saves a new test result
    @PostMapping("/save")
    public ResponseEntity<?> saveTestScore(@RequestBody ScoreRequest request) {
        TestScore savedScore = testScoreService.saveScore(request);
        
        if (savedScore != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(savedScore);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to save score. User not found.");
    }

    // 🚀 GET: Fetches the top 5 scores dynamically based on filters
    @GetMapping("/leaderboard")
    public ResponseEntity<List<TestScore>> getLeaderboard(
            @RequestParam String mode,
            @RequestParam(required = false) Integer timeLimit,
            @RequestParam(required = false) Integer wordLimit,
            @RequestParam boolean punctuation,
            @RequestParam boolean numbers) {
            
        List<TestScore> topScores = testScoreService.getLeaderboard(mode, timeLimit, wordLimit, punctuation, numbers);
        return ResponseEntity.ok(topScores);
    }
}