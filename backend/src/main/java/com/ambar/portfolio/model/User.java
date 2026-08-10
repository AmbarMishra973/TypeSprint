package com.ambar.portfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;

@Entity
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;

    private String email;

    private String password;


    public User() {

    }
    // Add this to your User.java fields
    
    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    // Add this to your User entity
    @Column(name = "xp", columnDefinition = "integer default 0")
    private int xp = 0;

    // Add the Getter and Setter at the bottom of your file
    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    
    @Column(columnDefinition = "TEXT")
    private String typingStats;


    public User(String name, String email, String password) {

        this.name = name;
        this.email = email;
        this.password = password;

    }


    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }

    public String getTypingStats() {
        return typingStats;
    }

    public void setTypingStats(String typingStats) {
        this.typingStats = typingStats;
    }

    @ElementCollection
    private List<String> friends = new ArrayList<>();

    @ElementCollection
    private List<String> friendRequests = new ArrayList<>(); 

    @ElementCollection
    private List<String> sentRequests = new ArrayList<>(); 

    // --- GETTERS AND SETTERS ---

    public List<String> getFriends() {
        return friends;
    }

    public void setFriends(List<String> friends) {
        this.friends = friends;
    }

    public List<String> getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(List<String> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public List<String> getSentRequests() {
        return sentRequests;
    }

    public void setSentRequests(List<String> sentRequests) {
        this.sentRequests = sentRequests;
    }

    

    // Add Getter and Setter
    public int getXp() { return xp; }
    public void setXp(int xp) { this xp = xp; }

    // 🏆 Dynamic Rank Calculator
    public String getRank() {
        if (xp < 1000) return "Novice";
        if (xp < 5000) return "Amateur";
        if (xp < 15000) return "Expert";
        if (xp < 35000) return "Master";
        return "Grandmaster";
    }
}