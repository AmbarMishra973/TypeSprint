package com.ambar.portfolio.controller;

import com.ambar.portfolio.model.User;
import com.ambar.portfolio.service.UserService;
import com.ambar.portfolio.repository.UserRepository;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        // Matches userService.login(...)
        User user = userService.login(request.getName(), request.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User request) {
        // Check if user already exists
        if (userService.existsByName(request.getName())) {
            return ResponseEntity.status(400).body("User already exists");
        }
        // Matches userService.signup(...)
        User user = userService.signup(request);
        if (user == null) {
            return ResponseEntity.status(400).body("Signup failed");
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/sync")
    public ResponseEntity<?> syncStats(@RequestBody User request) {
        User updatedUser = userService.syncStats(request.getName(), request.getPassword(), request.getTypingStats());
        if (updatedUser == null) {
            return ResponseEntity.status(404).body("User not found for sync");
        }
        return ResponseEntity.ok(updatedUser);
    }
    @GetMapping("/search")
public ResponseEntity<?> searchUsers(@RequestParam String query) {
    List<User> users = userService.searchUsers(query);
    // Remove sensitive data (like passwords) before sending to frontend!
    users.forEach(u -> u.setPassword(null)); 
    return ResponseEntity.ok(users);
}

// ➕ Endpoint to add a friend
@PostMapping("/{username}/request-friend/{receiverName}")
    public ResponseEntity<?> sendRequest(@PathVariable String username, @PathVariable String receiverName) {
        return ResponseEntity.ok(userService.sendFriendRequest(username, receiverName));
    }

    @PostMapping("/{username}/accept-friend/{requesterName}")
    public ResponseEntity<?> acceptRequest(@PathVariable String username, @PathVariable String requesterName) {
        return ResponseEntity.ok(userService.acceptFriendRequest(username, requesterName));
    }

    @PostMapping("/{username}/reject-friend/{requesterName}")
    public ResponseEntity<?> rejectRequest(@PathVariable String username, @PathVariable String requesterName) {
        return ResponseEntity.ok(userService.rejectFriendRequest(username, requesterName));
    }

    @PostMapping("/{username}/remove-friend/{friendName}")
    public ResponseEntity<?> removeFriend(@PathVariable String username, @PathVariable String friendName) {
        return ResponseEntity.ok(userService.removeFriend(username, friendName));
    }
    @PostMapping("/update-xp")
public ResponseEntity<?> updateUserXp(@RequestBody Map<String, Object> request) {
    String email = (String) request.get("email");
    Integer xpGained = (Integer) request.get("xpGained");

    if (email == null || xpGained == null) {
        return ResponseEntity.badRequest().body("Email and xpGained are required");
    }

    User user = userRepository.findFirstByEmail(email);
    if (user != null) {
        user.setXp(user.getXp() + xpGained);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
}
}