package com.acadex.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class NoteComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comment;
    @ManyToOne
    private Note note;
    @ManyToOne
    private User user;
    private LocalDateTime commentedAt;

    @PrePersist
    public void prePersist() {
        this.commentedAt = LocalDateTime.now();
    }

}
