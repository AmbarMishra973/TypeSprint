package com.ambar.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "test_scores")
public class TestScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🚀 Links this score directly to a user in your database
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private int wpm;
    private int accuracy;
    
    private String mode; // "time", "words", or "quote"
    
    // We use Integer (wrapper class) instead of int so they can be null 
    // (e.g., a "words" test won't have a time limit)
    private Integer timeLimit; 
    private Integer wordLimit; 
    
    private boolean punctuation;
    private boolean numbers;
    
    private Long timestamp; // Stores Date.now() from the frontend

    public TestScore() {
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getWpm() {
        return wpm;
    }

    public void setWpm(int wpm) {
        this.wpm = wpm;
    }

    public int getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(int accuracy) {
        this.accuracy = accuracy;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Integer getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(Integer timeLimit) {
        this.timeLimit = timeLimit;
    }

    public Integer getWordLimit() {
        return wordLimit;
    }

    public void setWordLimit(Integer wordLimit) {
        this.wordLimit = wordLimit;
    }

    public boolean isPunctuation() {
        return punctuation;
    }

    public void setPunctuation(boolean punctuation) {
        this.punctuation = punctuation;
    }

    public boolean isNumbers() {
        return numbers;
    }

    public void setNumbers(boolean numbers) {
        this.numbers = numbers;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}