package com.acadex.Project;

import com.acadex.common.ApiResponse;
import com.acadex.model.Project;
import com.acadex.requestDto.ProjectDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<?>> uploadProject(@ModelAttribute ProjectDto projectDto ) {
        return projectService.uploadProject(projectDto);
    }
}
