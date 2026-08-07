package com.ambar.portfolio.dto;

public class ScoreRequest {
    
    private String username;
    private int wpm;
    private int accuracy;
    private String mode;
    private Integer timeLimit;
    private Integer wordLimit;
    private boolean punctuation;
    private boolean numbers;
    private Long timestamp;

    public ScoreRequest() {}

    // --- Getters and Setters ---

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getWpm() { return wpm; }
    public void setWpm(int wpm) { this.wpm = wpm; }

    public int getAccuracy() { return accuracy; }
    public void setAccuracy(int accuracy) { this.accuracy = accuracy; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public Integer getTimeLimit() { return timeLimit; }
    public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }

    public Integer getWordLimit() { return wordLimit; }
    public void setWordLimit(Integer wordLimit) { this.wordLimit = wordLimit; }

    public boolean isPunctuation() { return punctuation; }
    public void setPunctuation(boolean punctuation) { this.punctuation = punctuation; }

    public boolean isNumbers() { return numbers; }
    public void setNumbers(boolean numbers) { this.numbers = numbers; }

    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
}