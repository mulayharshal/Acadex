package com.acadex.project;

import com.acadex.common.ApiResponse;
import com.acadex.model.Project;
import com.acadex.model.ProjectComment;
import com.acadex.model.ProjectLike;
import com.acadex.requestDto.ProjectDto;
import com.acadex.requestDto.commentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

//    upload the project
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<?>> uploadProject(@ModelAttribute ProjectDto projectDto ) {
        return projectService.uploadProject(projectDto);
    }

//    get all projects
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects(){
        return projectService.getAllProjects();
    }

//    get one project
    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long projectId){
        return  projectService.getProjectById(projectId);
    }

//    like the project
    @PostMapping("/{projectId}/like")
    public ResponseEntity<ApiResponse<?>> likePrject(@PathVariable Long projectId){
        return projectService.likeProject(projectId);
    }

//    save unsave the project
    @PostMapping("/{projectId}/save")
    public ResponseEntity<ApiResponse<?>> saveProject(@PathVariable Long projectId){
        return projectService.saveProject(projectId);
    }

//    comment on project
    @PostMapping("/{projectId}/comment")
    public ResponseEntity<ApiResponse<?>> saveProjectComment(@PathVariable Long projectId,@RequestBody commentDto commentDto){
        return projectService.commentProject(projectId,commentDto.getComment());
    }

//    delete comment
    @DeleteMapping("/{projectId}/comment/{commentId}")
    public  ResponseEntity<ApiResponse<String>> deleteProjectComment(@PathVariable Long projectId,@PathVariable Long commentId){
        return projectService.deleteCommentProject(projectId,commentId);
    }

//    get all comments
    @GetMapping("/{projectId}/comment")
    public ResponseEntity<ApiResponse<List<ProjectComment>>> getProjectComment(@PathVariable Long projectId){
        return  projectService.getAllComments(projectId);
    }

}
