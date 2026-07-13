package com.acadex.project;

import com.acadex.auth.AuthRepository;
import com.acadex.common.ApiResponse;
import com.acadex.config.CloudinaryService;
import com.acadex.config.EmailService;
import com.acadex.config.FileStorageService;
import com.acadex.dto.UpdateProjectDto;
import com.acadex.model.*;
import com.acadex.dto.ProjectDto;
import com.acadex.notification.FcmTokenRepository;
import com.acadex.notification.NotificationService;
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
    CloudinaryService cloudinaryService;

    @Autowired
    private ProjectLikeRepository projectLikeRepository;

    @Autowired
    private ProjectSaveRepository projectSaveRepository;

    @Autowired
    private ProjectCommentRepository projectCommentRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

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

//            for local store
//            project.setFile(fileStorageService.saveFile(projectDto.getFile(),"projects"));
//            project.setImage(fileStorageService.saveFile(projectDto.getImage(),"images"));
//            for online cludnairy
            project.setImage(cloudinaryService.uploadFile(projectDto.getImage(), "acadex/project-images"));
            project.setFile(cloudinaryService.uploadRawFile(projectDto.getFile(), "acadex/project-files"));

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
        emailService.sendProjectDeleted(email,project.getUploadedBy().getName(),project.getTitle());
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully.","Project deleted successfully"));
    }

//    get all projects
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects(){
        List<Project> projects=projectRepository.findAllByOrderByUploadedDateDesc();
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

            User projectOwner=project.getUploadedBy();
            List<FcmToken> fcmTokens=fcmTokenRepository.findAllByUser(projectOwner);
            for(FcmToken fcmToken:fcmTokens){
                notificationService.sendNotification(fcmToken.getToken(),"❤\uFE0F Someone liked your project",user.getName() +" liked your project \" "+project.getTitle()+"\" ");
            }

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

            User projectOwner=project.getUploadedBy();
            List<FcmToken> fcmTokens=fcmTokenRepository.findAllByUser(projectOwner);
            for(FcmToken fcmToken:fcmTokens){
                notificationService.sendNotification(fcmToken.getToken(),"\uD83D\uDD16 Your project was saved",user.getName() +" saved your project \" "+project.getTitle()+"\" ");
            }
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

        User projectOwner=project.getUploadedBy();
        List<FcmToken> fcmTokens=fcmTokenRepository.findAllByUser(projectOwner);
        for(FcmToken fcmToken:fcmTokens){
            notificationService.sendNotification(fcmToken.getToken(),"\uD83D\uDCAC New comment on your project",user.getName() +" commented on your project  \" "+project.getTitle()+"\" ");
        }
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

//    get my projects only
    public ResponseEntity<ApiResponse<List<Project>>> getMyProjects() {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        if(user==null){
            return ResponseEntity.ok(ApiResponse.error("User Or Project not found"));
        }
        List<Project> myProjects= projectRepository.findAllByUploadedByOrderByUploadedDateDesc(user);
        return ResponseEntity.ok(ApiResponse.success("your Projects",myProjects));
    }

//    update project
    public ResponseEntity<ApiResponse<Project>> updateProject(Long projectId, UpdateProjectDto updateProjectDto) {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        Project project=projectRepository.findById(projectId).orElse(null);
        if(project==null){
            return ResponseEntity.ok(ApiResponse.error("Project not found"));
        }
        if(user==null){
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        }
        if(!user.getEmail().equals(project.getUploadedBy().getEmail())){
            return ResponseEntity.ok(ApiResponse.error("You are not allowed to update"));
        }
        if (updateProjectDto.getTitle() == null || updateProjectDto.getTitle().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Title is required"));
        }
        if (updateProjectDto.getDescription() == null || updateProjectDto.getDescription().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Description is required"));
        }
        if(updateProjectDto.getTags() == null || updateProjectDto.getTags().trim().isEmpty()){
            return ResponseEntity.ok(ApiResponse.error("Tags is required"));
        }
        if(updateProjectDto.getTechStack() == null || updateProjectDto.getTechStack().trim().isEmpty()){
            return ResponseEntity.ok(ApiResponse.error("Tech stack is required"));
        }

        project.setTitle(updateProjectDto.getTitle().trim());
        project.setDescription(updateProjectDto.getDescription().trim());
        project.setTags(updateProjectDto.getTags().trim());
        project.setTechStack(updateProjectDto.getTechStack().trim());
        project.setLiveLink(updateProjectDto.getLiveLink() == null ? null : updateProjectDto.getLiveLink().trim());
        project.setYoutubeLink(updateProjectDto.getYoutubeLink() == null ? null : updateProjectDto.getYoutubeLink().trim());
        projectRepository.save(project);
        return  ResponseEntity.ok(ApiResponse.success("Project Updated",project));

    }

//    get my saved projects
    public ResponseEntity<ApiResponse<List<Project>>> getMySavedProjects() {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=authRepository.findByEmail(email).orElse(null);
        if(user==null){
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        }
        List<Project> projects = projectSaveRepository.findAllByUser(user)
                .stream()
                .map(ProjectSave::getProject)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("your saved Projects",projects));
    }
}
