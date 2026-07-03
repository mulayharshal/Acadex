package com.acadex.dto;

import lombok.Data;

@Data
public class UpdateProjectDto {

    private String title;
    private String description;
    private String tags;
    private String techStack;
    private String liveLink;
    private String youtubeLink;
}
