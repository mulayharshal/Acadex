package com.acadex.requestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class noteDto {
    private String title;
    private String description;
    private String category;
    private String tags;
    private MultipartFile file;

}
