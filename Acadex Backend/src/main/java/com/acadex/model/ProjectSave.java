package com.acadex.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ProjectSave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    @JoinColumn(name = "user_id")
    @ManyToOne
    private User user;

    private LocalDateTime savedAt;
    @PrePersist
    public void prePersist(){
        this.savedAt = LocalDateTime.now();
    }
}
