package com.acadex.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class noteDto {
    private String title;
    private String description;
    private String category;
    private String tags;
    private MultipartFile file;

}
