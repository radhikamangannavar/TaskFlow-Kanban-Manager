package com.taskflow.taskflowbackend.controller;

import com.taskflow.taskflowbackend.entity.Task;
import com.taskflow.taskflowbackend.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin("*")

public class TaskController {

    @Autowired
    private TaskRepository taskRepository;


    // GET ALL TASKS
    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(
            @PathVariable Long userId) {

        return taskRepository.findByUserId(userId);
    }
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {

        return taskRepository.findById(id).orElseThrow();
    }

    // CREATE TASK
    @PostMapping
    public Task createTask(@RequestBody Task task) {

        return taskRepository.save(task);
    }


    // DELETE TASK
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {

        taskRepository.deleteById(id);
    }


    // UPDATE TASK
    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask) {

        Task task =
                taskRepository.findById(id).orElseThrow();

        task.setTitle(updatedTask.getTitle());

        task.setDescription(updatedTask.getDescription());

        task.setPriority(updatedTask.getPriority());

        task.setDeadline(updatedTask.getDeadline());

        task.setStatus(updatedTask.getStatus());

        return taskRepository.save(task);
    }
}