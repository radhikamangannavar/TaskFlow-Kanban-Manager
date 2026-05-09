package com.taskflow.taskflowbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.taskflow.taskflowbackend.entity.User;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String priority;

    private LocalDate deadline;

    private String status;
    @ManyToOne
    @JoinColumn(name = "user_id")

    private User user;
}