package com.taskflow.taskflowbackend.repository;

import com.taskflow.taskflowbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
        extends JpaRepository<User, Long> {

    User findByEmail(String email);
}