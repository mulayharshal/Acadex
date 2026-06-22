package com.acadex.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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
