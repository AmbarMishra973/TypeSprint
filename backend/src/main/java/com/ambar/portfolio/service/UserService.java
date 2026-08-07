package com.ambar.portfolio.service;

import com.ambar.portfolio.model.User;
import com.ambar.portfolio.repository.UserRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User signup(User user){
        return userRepository.save(user);
    }

    public User login(String name, String password){ // 👈 Changed parameter from email to name
        User user = userRepository.findFirstByName(name); // 👈 Changed to findByName

        if(user != null && user.getPassword().equals(password)){
            return user;
        }

        return null;
    }

    public boolean existsByName(String name) {
        return userRepository.findFirstByName(name) != null;
    }

    public boolean existsByEmail(String email) {
        return userRepository.findFirstByEmail(email) != null;
    }
    public User syncStats(String name, String password, String typingStats) {
    User user = userRepository.findFirstByName(name);
    if (user != null && user.getPassword().equals(password)) {
        user.setTypingStats(typingStats);
        return userRepository.save(user);
    }
    return null;
}
public List<User> searchUsers(String query) {
    return userRepository.findByNameContainingIgnoreCase(query);
}

// ➕ Add a friend
public User addFriend(String username, String friendName) {
    User user = userRepository.findFirstByName(username);
    User friend = userRepository.findFirstByName(friendName);

    // Make sure both users exist and they aren't already friends
    if (user != null && friend != null && !user.getFriends().contains(friendName)) {
        user.getFriends().add(friendName);
        return userRepository.save(user);
    }
    return user; // Return unchanged user if they are already friends
}
}