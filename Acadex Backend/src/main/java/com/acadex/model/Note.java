package com.acadex.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String category;
    private String tags;
    private String file;
    private int viewCount;
    private int likeCount;
    private int saveCount;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User uploadedBy;
    private LocalDateTime uploadedDate;


    @PrePersist
    public void prePersist(){
        this.uploadedDate=LocalDateTime.now();
        this.viewCount=0;
        this.likeCount=0;
        this.saveCount=0;
    }

}
