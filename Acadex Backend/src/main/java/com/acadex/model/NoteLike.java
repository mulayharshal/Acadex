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
@NoArgsConstructor
@AllArgsConstructor
public class NoteLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "note_id")
    private Note note;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime LikedAt;

    @PrePersist
    public void prePersist(){
        LikedAt = LocalDateTime.now();
    }
}
