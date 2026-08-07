package com.ambar.portfolio.repository;

import com.ambar.portfolio.model.TestScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestScoreRepository extends JpaRepository<TestScore, Long> {
    
    // 🚀 Grabs the Top 5 Time Mode scores (e.g., 30s, punctuation ON)
    List<TestScore> findTop5ByModeAndTimeLimitAndPunctuationAndNumbersOrderByWpmDesc(
            String mode, Integer timeLimit, boolean punctuation, boolean numbers
    );

    // 🚀 Grabs the Top 5 Words Mode scores (e.g., 25 words, numbers OFF)
    List<TestScore> findTop5ByModeAndWordLimitAndPunctuationAndNumbersOrderByWpmDesc(
            String mode, Integer wordLimit, boolean punctuation, boolean numbers
    );

    // 🚀 Grabs the Top 5 Quote Mode scores (Quotes don't have time/word limits)
    List<TestScore> findTop5ByModeAndPunctuationAndNumbersOrderByWpmDesc(
            String mode, boolean punctuation, boolean numbers
    );
}