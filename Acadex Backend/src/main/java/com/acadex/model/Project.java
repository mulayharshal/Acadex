package com.acadex.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String tags;
    private String techStack;
    private String file;
    private String image;
    private String liveLink;
    private String youtubeLink;
    private long viewCount;
    private long likeCount;
    private long saveCount;
    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    private LocalDateTime uploadedDate;

    @PrePersist
    public void prePersist() {
        this.uploadedDate = LocalDateTime.now();
    }

}
