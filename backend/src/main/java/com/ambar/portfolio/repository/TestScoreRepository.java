package com.ambar.portfolio.repository;

import com.ambar.portfolio.model.TestScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestScoreRepository extends JpaRepository<TestScore, Long> {

    // 1. For "time" mode (needs timeLimit)
    List<TestScore> findTop50ByModeAndTimeLimitAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
            String mode, Integer timeLimit, Boolean punctuation, Boolean numbers, Long timestamp);

    // 2. For "words" mode (needs wordLimit)
    List<TestScore> findTop50ByModeAndWordLimitAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
            String mode, Integer wordLimit, Boolean punctuation, Boolean numbers, Long timestamp);

    // 3. For "quote" mode (no limits)
    List<TestScore> findTop50ByModeAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
            String mode, Boolean punctuation, Boolean numbers, Long timestamp);
}