package com.ambar.portfolio.controller;

import com.ambar.portfolio.model.User;
import com.ambar.portfolio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        User user = userService.authenticate(request.getName(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User request) {
        User user = userService.register(request.getName(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(400).body("User already exists");
        }
        return ResponseEntity.ok(user);
    }

    // 🚀 Handles the stats sync call throwing the 404 error
    @PutMapping("/sync")
    public ResponseEntity<?> syncStats(@RequestBody User request) {
        User updatedUser = userService.syncStats(request.getName(), request.getPassword(), request.getTypingStats());
        if (updatedUser == null) {
            return ResponseEntity.status(404).body("User not found for sync");
        }
        return ResponseEntity.ok(updatedUser);
    }
}