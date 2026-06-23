package com.acadex.Project;

import com.acadex.auth.AuthRepository;
import com.acadex.common.ApiResponse;
import com.acadex.config.FileStorageService;
import com.acadex.model.Project;
import com.acadex.model.User;
import com.acadex.requestDto.ProjectDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private FileStorageService fileStorageService;

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


}
