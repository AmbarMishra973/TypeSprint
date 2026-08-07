package com.ambar.portfolio.repository;

import com.ambar.portfolio.model.TestScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestScoreRepository extends JpaRepository<TestScore, Long> {
    
    // 🚀 Grabs the Top 5 Time Mode scores (e.g., 30s, punctuation ON)
    List<TestScore> findTop50ByModeAndTimeLimitAndWordLimitAndPunctuationAndNumbersAndTimestampGreaterThanEqualOrderByWpmDesc(
            String mode, 
            Integer timeLimit, 
            Integer wordLimit, 
            Boolean punctuation, 
            Boolean numbers, 
            Long timestamp
    );
}