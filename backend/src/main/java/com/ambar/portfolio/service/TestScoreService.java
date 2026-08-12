package com.ambar.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ambar.portfolio.dto.ScoreRequest;
import com.ambar.portfolio.model.TestScore;
import com.ambar.portfolio.model.User;
import com.ambar.portfolio.repository.TestScoreRepository;
import com.ambar.portfolio.repository.UserRepository;

@Service
public class TestScoreService {

    private final TestScoreRepository testScoreRepository;
    private final UserRepository userRepository;

    public TestScoreService(
            TestScoreRepository testScoreRepository,
            UserRepository userRepository) {
        this.testScoreRepository = testScoreRepository;
        this.userRepository = userRepository;
    }

    /**
     * Saves a test score and associates it with the user's profile.
     */
    public TestScore saveScore(ScoreRequest request) {
        User user = userRepository.findFirstByName(request.getUsername());

        if (user == null) {
            return null;
        }

        TestScore score = new TestScore();

        score.setUser(user);
        score.setWpm(request.getWpm());
        score.setAccuracy(request.getAccuracy());
        score.setMode(request.getMode());
        score.setTimeLimit(request.getTimeLimit());
        score.setWordLimit(request.getWordLimit());
        score.setPunctuation(request.isPunctuation());
        score.setNumbers(request.isNumbers());
        score.setTimestamp(request.getTimestamp());

        return testScoreRepository.save(score);
    }

    /**
     * Returns the top scores for the selected test mode and filters.
     */
    public List<TestScore> getLeaderboard(
            String mode,
            Integer timeLimit,
            Integer wordLimit,
            boolean punctuation,
            boolean numbers,
            Long timestamp) {

        if ("time".equalsIgnoreCase(mode)) {
            return testScoreRepository
                    .findTop50ByModeAndTimeLimitAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
                            mode,
                            timeLimit,
                            punctuation,
                            numbers,
                            timestamp);
        }

        if ("words".equalsIgnoreCase(mode)) {
            return testScoreRepository
                    .findTop50ByModeAndWordLimitAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
                            mode,
                            wordLimit,
                            punctuation,
                            numbers,
                            timestamp);
        }

        return testScoreRepository
                .findTop50ByModeAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
                        mode,
                        punctuation,
                        numbers,
                        timestamp);
    }
}