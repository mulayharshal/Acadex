package com.acadex.requestDto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProjectDto {
    private String title;
    private String description;
    private String tags;
    private String techStack;
    private MultipartFile file;
    private MultipartFile image;
    private String liveLink;
    private String youtubeLink;

}
