package com.acadex.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ProjectComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    private Project project;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    private String comment;
    private LocalDateTime commentDate;
    @PrePersist
    public void prePersist(){
        this.commentDate = LocalDateTime.now();
    }
}
