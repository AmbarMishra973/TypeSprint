package com.ambar.portfolio.repository;

import com.ambar.portfolio.model.DailyScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyScoreRepository extends JpaRepository<DailyScore, Long> {
    // Automatically fetches today's scores and sorts them by highest WPM
    List<DailyScore> findByChallengeDateOrderByWpmDesc(LocalDate challengeDate);
}