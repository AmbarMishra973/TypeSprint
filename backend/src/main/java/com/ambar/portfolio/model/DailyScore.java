package com.ambar.portfolio.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_scores")
public class DailyScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private int wpm;
    private double accuracy;
    private LocalDate challengeDate;

    public DailyScore() {
    }

    public DailyScore(
            String username,
            int wpm,
            double accuracy,
            LocalDate challengeDate
    ) {
        this.username = username;
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.challengeDate = challengeDate;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getWpm() {
        return wpm;
    }

    public void setWpm(int wpm) {
        this.wpm = wpm;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public LocalDate getChallengeDate() {
        return challengeDate;
    }

    public void setChallengeDate(LocalDate challengeDate) {
        this.challengeDate = challengeDate;
    }
}