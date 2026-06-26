package com.acadex.dto;

import lombok.Data;

@Data
public class UpdateProfileDto {
    private String name;
    private String username;
    private String mobile;
    private String bio;
}
