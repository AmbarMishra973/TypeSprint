package com.ambar.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ambar.portfolio.model.User;
import com.ambar.portfolio.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User signup(User user) {
        return userRepository.save(user);
    }

    public User login(String name, String password) {
        User user = userRepository.findFirstByName(name);

        if (user != null && user.getPassword().equals(password)) {
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

    public User sendFriendRequest(String senderName, String receiverName) {
        User sender = userRepository.findFirstByName(senderName);
        User receiver = userRepository.findFirstByName(receiverName);

        if (sender != null && receiver != null) {
            if (!receiver.getFriendRequests().contains(senderName)) {
                receiver.getFriendRequests().add(senderName);
            }

            if (!sender.getSentRequests().contains(receiverName)) {
                sender.getSentRequests().add(receiverName);
            }

            userRepository.save(receiver);
            return userRepository.save(sender);
        }

        return sender;
    }

    public User acceptFriendRequest(String username, String requesterName) {
        User user = userRepository.findFirstByName(username);
        User requester = userRepository.findFirstByName(requesterName);

        if (user != null && requester != null) {
            user.getFriendRequests().remove(requesterName);
            requester.getSentRequests().remove(username);

            if (!user.getFriends().contains(requesterName)) {
                user.getFriends().add(requesterName);
            }

            if (!requester.getFriends().contains(username)) {
                requester.getFriends().add(username);
            }

            userRepository.save(requester);
            return userRepository.save(user);
        }

        return user;
    }

    public User rejectFriendRequest(String username, String requesterName) {
        User user = userRepository.findFirstByName(username);
        User requester = userRepository.findFirstByName(requesterName);

        if (user != null && requester != null) {
            user.getFriendRequests().remove(requesterName);
            requester.getSentRequests().remove(username);

            userRepository.save(requester);
            return userRepository.save(user);
        }

        return user;
    }

    public User removeFriend(String username, String friendName) {
        User user = userRepository.findFirstByName(username);
        User friend = userRepository.findFirstByName(friendName);

        if (user != null && friend != null) {
            user.getFriends().remove(friendName);
            friend.getFriends().remove(username);

            userRepository.save(friend);
            return userRepository.save(user);
        }

        return user;
    }
}