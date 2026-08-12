package com.ambar.portfolio.service;

import java.time.LocalDate;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class DailyChallengeService {

    private final String[] wordBank = {
        "The", "future", "belongs", "to", "those", "who", "believe", "in",
        "the", "beauty", "of", "their", "dreams", "success", "is", "not",
        "final", "failure", "fatal", "courage", "counts", "code", "sleep",
        "repeat", "keyboard", "hacker", "terminal", "system"
    };

    /**
     * Generates the same challenge text for every user on the same day.
     */
    public String getDailyText() {
        LocalDate today = LocalDate.now();

        long seed = today.getYear() * 10000L
                + today.getMonthValue() * 100L
                + today.getDayOfMonth();

        Random seededRandom = new Random(seed);

        StringBuilder text = new StringBuilder();

        for (int i = 0; i < 30; i++) {
            text.append(wordBank[seededRandom.nextInt(wordBank.length)]);

            if (i < 29) {
                text.append(" ");
            }
        }

        return text.toString();
    }
}