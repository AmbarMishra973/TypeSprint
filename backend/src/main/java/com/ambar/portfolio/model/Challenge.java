package com.ambar.portfolio.model;

import jakarta.persistence.*;

@Entity
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;
    private String receiverName;
    private int duration; // 15, 30, or 60 seconds
    private String status; // PENDING, ACCEPTED, DECLINED, COMPLETED

    // Stats for when the challenge is played
    private int senderWpm;
    private int receiverWpm;
    private String winnerName;

    // 🕒 Use Long object so existing database records with NULL don't crash the server
    private Long createdAt;


    @Column(columnDefinition = "TEXT")
    private String wordsText; // Stores space-separated words for the rac

    public Challenge() {}

    public Challenge(String senderName, String receiverName, int duration) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.duration = duration;
        this.status = "PENDING";
        this.createdAt = System.currentTimeMillis();
    }

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getSenderWpm() { return senderWpm; }
    public void setSenderWpm(int senderWpm) { this.senderWpm = senderWpm; }
    public int getReceiverWpm() { return receiverWpm; }
    public void setReceiverWpm(int receiverWpm) { this.receiverWpm = receiverWpm; }
    public String getWinnerName() { return winnerName; }
    public void setWinnerName(String winnerName) { this.winnerName = winnerName; }
   
    public String getWordsText() { return wordsText; }
    public void setWordsText(String wordsText) { this.wordsText = wordsText; }


    // Getters and setters
    public Long getCreatedAt() { 
        // If it's an old database record (null), return 0 so it gets instantly auto-cleaned up!
        return createdAt != null ? createdAt : 0L; 
    }
    
    public void setCreatedAt(Long createdAt) { 
        this.createdAt = createdAt; 
    }
}