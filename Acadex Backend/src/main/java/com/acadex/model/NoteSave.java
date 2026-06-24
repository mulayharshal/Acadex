package com.acadex.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
