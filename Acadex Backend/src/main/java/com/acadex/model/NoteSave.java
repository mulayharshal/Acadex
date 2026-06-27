package com.acadex.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
public class NoteSave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "note_id")
    private Note note;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime date;

    @PrePersist
    public void prePersist() {
        this.date = LocalDateTime.now();
    }
}
