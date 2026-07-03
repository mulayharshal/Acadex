package com.acadex.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileDto {
    private String name;
    private String username;
    private String mobile;
    private String bio;
    private MultipartFile profileImage;
}
