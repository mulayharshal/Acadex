package com.acadex.project;

import com.acadex.auth.AuthRepository;
import com.acadex.common.ApiResponse;
import com.acadex.config.FileStorageService;
import com.acadex.model.*;
import com.acadex.dto.ProjectDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ProjectLikeRepository projectLikeRepository;

    @Autowired
    private ProjectSaveRepository projectSaveRepository;

    @Autowired
    private ProjectCommentRepository projectCommentRepository;

//    upload the projects
    public ResponseEntity<ApiResponse<?>> uploadProject(ProjectDto projectDto){
        try{
            String email= SecurityContextHolder.getContext().getAuthentication().getName();
            User user=authRepository.findByEmail(email).orElse(null);
            if(user==null){
                return  ResponseEntity.ok(ApiResponse.error("User not found"));
            }
            if (projectDto.getFile() == null ||
                    projectDto.getFile().isEmpty() ||
                    projectDto.getImage() == null ||
                    projectDto.getImage().isEmpty()) {

                return ResponseEntity.ok(
                        ApiResponse.error("File or Image not found"));
            }

            Project project=new Project();
            project.setTitle(projectDto.getTitle());
            project.setDescription(projectDto.getDescription());
            project.setLiveLink(projectDto.getLiveLink());
            project.setYoutubeLink(projectDto.getYoutubeLink());
            project.setTags(projectDto.getTags());
            project.setTechStack(projectDto.getTechStack());
            project.setUploadedBy(user);
            project.setFile(fileStorageService.saveFile(projectDto.getFile(),"projects"));
            project.setImage(fileStorageService.saveFile(projectDto.getImage(),"images"));
            Project upladedProject=projectRepository.save(project);
            return ResponseEntity.ok(ApiResponse.success("Project Uploaded successfully",upladedProject));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(ApiResponse.error("Project Upload failed"));
        }
    }

//    delete the project
    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteProject(@PathVariable Long projectId){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        Project project=projectRepository.findById(projectId).orElse(null);
        if(project==null){
            return ResponseEntity.ok(ApiResponse.error("Project not found"));
        }
        if(!project.getUploadedBy().getEmail().equals(user.getEmail())){
            return ResponseEntity.ok(ApiResponse.error("You are not allowed to delete this project"));
        }
        projectLikeRepository.deleteAllByProject(project);
        projectSaveRepository.deleteAllByProject(project);
        projectCommentRepository.deleteAllByProject(project);
        projectRepository.delete(project);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully.","Project deleted successfully"));
    }

//    get all projects
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects(){
        List<Project> projects=projectRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Project List",projects));
    }

//    get one project
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id){
        Project project=projectRepository.findById(id).orElse(null);
        if(project==null){
            return ResponseEntity.ok(ApiResponse.error("Project not found"));
        }
        project.setViewCount(project.getViewCount()+1);
        projectRepository.save(project);
        return ResponseEntity.ok(ApiResponse.success("Project found",project));
    }

//    like the project
    @Transactional
    public ResponseEntity<ApiResponse<?>>  likeProject(Long projectId){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        Project project=projectRepository.findById(projectId).orElse(null);
        if(user==null|| project==null){
            return ResponseEntity.ok(ApiResponse.error("User Or Project not found"));
        }
        if(projectLikeRepository.existsByProjectIdAndUserId(projectId,user.getId())){
            projectLikeRepository.deleteByProjectIdAndUserId(projectId,user.getId());
            project.setLikeCount(project.getLikeCount()-1);
            projectRepository.save(project);
            return ResponseEntity.ok(ApiResponse.success("Project unliked success",project));
        }else {
            ProjectLike projectLike=new ProjectLike();
            projectLike.setProject(project);
            projectLike.setUser(user);
            ProjectLike savedLike=projectLikeRepository.save(projectLike);
            project.setLikeCount(project.getLikeCount()+1);
            projectRepository.save(project);
            return ResponseEntity.ok(ApiResponse.success("Project liked success",project));
        }
    }

//    save unsave project
    @Transactional
    public ResponseEntity<ApiResponse<?>> saveProject(Long projectId){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        Project project=projectRepository.findById(projectId).orElse(null);
        if(user==null|| project==null){
            return ResponseEntity.ok(ApiResponse.error("User Or Project not found"));
        }
        if(projectSaveRepository.existsByUserAndProject(user,project)){
            projectSaveRepository.deleteByUserAndProject(user,project);
            project.setSaveCount(project.getSaveCount()-1);
            projectRepository.save(project);
            return ResponseEntity.ok(ApiResponse.success("Project unsaved succes",project));
        }else {
            ProjectSave projectSave=new ProjectSave();
            projectSave.setUser(user);
            projectSave.setProject(project);
            ProjectSave saved=projectSaveRepository.save(projectSave);
            project.setSaveCount(project.getSaveCount()+1);
            projectRepository.save(project);
            return ResponseEntity.ok(ApiResponse.success("Project saved successfully",project));
        }
    }

//    comment on projects
    @Transactional
    public ResponseEntity<ApiResponse<?>> commentProject(Long projectId ,String comment){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        Project project=projectRepository.findById(projectId).orElse(null);
        if(user==null|| project==null){
            return ResponseEntity.ok(ApiResponse.error("User Or Project not found"));
        }
        ProjectComment projectComment=new ProjectComment();
        projectComment.setProject(project);
        projectComment.setComment(comment);
        projectComment.setUser(user);
        projectCommentRepository.save(projectComment);
        return ResponseEntity.ok(ApiResponse.success("Project commented successfully",projectComment));
    }

//    delete comment
    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteCommentProject(Long projectId, Long commentId){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        Project project=projectRepository.findById(projectId).orElse(null);
        if(user==null|| project==null){
            return ResponseEntity.ok(ApiResponse.error("User Or Project not found"));
        }
        ProjectComment projectComment=projectCommentRepository.findById(commentId).orElse(null);
        if(projectComment==null){
            return ResponseEntity.ok(ApiResponse.error("Project comment not found"));
        }
        if(projectComment.getUser().getEmail().equals(user.getEmail()) || project.getUploadedBy().getEmail().equals(user.getEmail())){
            projectCommentRepository.delete(projectComment);
            return ResponseEntity.ok(ApiResponse.success("Comment deleted success", "Comment deleted successfully"));
        }else {
            return ResponseEntity.ok(ApiResponse.error("You are not allowed to delete"));
        }

    }

//    get all comments om project
    @Transactional
    public ResponseEntity<ApiResponse<List<ProjectComment>>> getAllComments( Long projectId){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        Project project=projectRepository.findById(projectId).orElse(null);
        if(project==null){
            return ResponseEntity.ok(ApiResponse.error("Project not found"));
        }
        List<ProjectComment> projectComments=projectCommentRepository.getAllByProject(project);
        return ResponseEntity.ok(ApiResponse.success("Project All comments",projectComments));
    }

//    search projects
    @Transactional
    public ResponseEntity<ApiResponse<List<Project>>> searchProjects(String keyword){
        if(keyword==null||keyword.isEmpty()){
            return ResponseEntity.ok(ApiResponse.error("Keyword empty"));
        }
        List<Project> projects=projectRepository.searchProjects(keyword);
        return ResponseEntity.ok(ApiResponse.success("Project searched",projects));
    }

}
