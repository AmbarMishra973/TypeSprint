package com.ambar.portfolio.controller;

import com.ambar.portfolio.model.User;
import com.ambar.portfolio.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        User savedUser = userService.signup(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // 🚀 Changed from ResponseEntity<String> to ResponseEntity<?>
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Name cannot be empty");
        }
        
        User loggedUser = userService.login(
                user.getName(),
                user.getPassword()
        );

        if (loggedUser != null) {
            // 🚀 Return the actual user object here!
            return ResponseEntity.ok(loggedUser);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }
    @PutMapping("/update-picture")
    public ResponseEntity<?> updateProfilePicture(@RequestBody User userRequest) {
        // Find the user in the database by their name or ID
        User existingUser = userService.login(userRequest.getName(), userRequest.getPassword());
        
        if (existingUser != null) {
            existingUser.setProfilePicture(userRequest.getProfilePicture());
            userService.signup(existingUser); // Re-save the user with the new picture
            return ResponseEntity.ok(existingUser);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
    }

    @PutMapping("/sync-stats")
    public ResponseEntity<?> syncStats(@RequestBody User userRequest) {
        // Find the user to verify credentials
        User existingUser = userService.login(userRequest.getName(), userRequest.getPassword());
        
        if (existingUser != null) {
            existingUser.setTypingStats(userRequest.getTypingStats());
            userService.signup(existingUser); // Re-save the user with updated stats
            return ResponseEntity.ok(existingUser);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
    }
}