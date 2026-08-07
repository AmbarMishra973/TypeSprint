package com.ambar.portfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

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

}