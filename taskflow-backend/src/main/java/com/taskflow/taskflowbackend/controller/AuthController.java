package com.taskflow.taskflowbackend.controller;

import com.taskflow.taskflowbackend.entity.User;
import com.taskflow.taskflowbackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")

public class AuthController {

    @Autowired
    private UserRepository userRepository;


    // REGISTER
    @PostMapping("/register")
    public String registerUser(
            @RequestBody User user) {

        // CHECK EXISTING EMAIL
        User existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {

            return "Email already exists";
        }

        userRepository.save(user);

        return "Registration successful";
    }
    @PostMapping("/login")
    public User loginUser(
            @RequestBody User user) {

        User existingUser =
                userRepository.findByEmail(user.getEmail());


        if (existingUser == null) {

            return null;
        }


        if (!existingUser.getPassword()
                .equals(user.getPassword())) {

            return null;
        }


        return existingUser;
    }
}