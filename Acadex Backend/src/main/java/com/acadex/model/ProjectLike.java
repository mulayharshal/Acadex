package com.acadex.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Data
public class ProjectLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime LikedAt;

    @PrePersist
    public void prePersist(){
        this.LikedAt = LocalDateTime.now();
    }

}
