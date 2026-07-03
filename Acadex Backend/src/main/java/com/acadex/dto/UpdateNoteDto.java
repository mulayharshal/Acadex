package com.acadex.dto;


import lombok.Data;

@Data
public class UpdateNoteDto {

    private String title;
    private String description;
    private String category;
    private String tags;

}