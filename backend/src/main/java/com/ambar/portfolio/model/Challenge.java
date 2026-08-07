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

    public Challenge() {}

    public Challenge(String senderName, String receiverName, int duration) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.duration = duration;
        this.status = "PENDING";
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
}