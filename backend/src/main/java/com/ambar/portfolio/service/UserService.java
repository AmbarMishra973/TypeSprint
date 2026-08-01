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



    public User login(String email, String password){


        User user = userRepository.findByEmail(email);


        if(user != null && user.getPassword().equals(password)){

            return user;

        }


        return null;

    }

}