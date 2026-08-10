package com.ambar.portfolio.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Random;

@Service
public class DailyChallengeService {

    // A list of cool quotes or standard words
    private final String[] wordBank = {
        "The", "future", "belongs", "to", "those", "who", "believe", "in", "the", "beauty", 
        "of", "their", "dreams", "success", "is", "not", "final", "failure", "fatal", "courage", 
        "counts", "code", "sleep", "repeat", "keyboard", "hacker", "terminal", "system"
    };

    // 📅 Generate the exact same text for everyone on the same day
    public String getDailyText() {
        // Get today's date (e.g., 2026-08-10)
        LocalDate today = LocalDate.now();
        
        // Convert the date to a unique integer seed (e.g., 20260810)
        long seed = today.getYear() * 10000L + today.getMonthValue() * 100 + today.getDayOfMonth();
        
        // Use the seed to initialize the Random generator
        Random seededRandom = new Random(seed);
        
        StringBuilder sb = new StringBuilder();
        // Generate 30 words that will be identical for anyone asking today
        for (int i = 0; i < 30; i++) {
            sb.append(wordBank[seededRandom.nextInt(wordBank.length)]).append(" ");
        }
        
        return sb.toString().trim();
    }
}