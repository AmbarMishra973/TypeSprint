package com.ambar.portfolio.service;

import com.ambar.portfolio.model.User;
import com.ambar.portfolio.repository.UserRepository;
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
}