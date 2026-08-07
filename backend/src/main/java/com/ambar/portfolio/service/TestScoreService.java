package com.ambar.portfolio.service;

import com.ambar.portfolio.dto.ScoreRequest;
import com.ambar.portfolio.model.TestScore;
import com.ambar.portfolio.model.User;
import com.ambar.portfolio.repository.TestScoreRepository;
import com.ambar.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestScoreService {

    private final TestScoreRepository testScoreRepository;
    private final UserRepository userRepository;

    public TestScoreService(TestScoreRepository testScoreRepository, UserRepository userRepository) {
        this.testScoreRepository = testScoreRepository;
        this.userRepository = userRepository;
    }

    // 🚀 Saves a new score and links it to the user profile
    public TestScore saveScore(ScoreRequest req) {
        User user = userRepository.findFirstByName(req.getUsername());
        
        if (user == null) {
            return null; // User must exist to save a score
        }

        TestScore score = new TestScore();
        score.setUser(user);
        score.setWpm(req.getWpm());
        score.setAccuracy(req.getAccuracy());
        score.setMode(req.getMode());
        score.setTimeLimit(req.getTimeLimit());
        score.setWordLimit(req.getWordLimit());
        score.setPunctuation(req.isPunctuation());
        score.setNumbers(req.isNumbers());
        score.setTimestamp(req.getTimestamp());

        return testScoreRepository.save(score);
    }

    // 🚀 Routes the request to the correct query based on the test mode
    // 🚀 Routes the request to the correct query including timestamp filtering
    public List<TestScore> getLeaderboard(String mode, Integer timeLimit, Integer wordLimit, boolean punctuation, boolean numbers, Long timestamp) {
        if ("time".equalsIgnoreCase(mode)) {
            return testScoreRepository.findTop50ByModeAndTimeLimitAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
                    mode, timeLimit, punctuation, numbers, timestamp);
                    
        } else if ("words".equalsIgnoreCase(mode)) {
            return testScoreRepository.findTop50ByModeAndWordLimitAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
                    mode, wordLimit, punctuation, numbers, timestamp);
                    
        } else {
            // Quote mode doesn't use time or word limits
            return testScoreRepository.findTop50ByModeAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
                    mode, punctuation, numbers, timestamp);
        }
    }
}