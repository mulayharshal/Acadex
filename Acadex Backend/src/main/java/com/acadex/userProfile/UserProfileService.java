package com.acadex.userProfile;

import com.acadex.auth.AuthRepository;
import com.acadex.common.ApiResponse;
import com.acadex.config.CloudinaryService;
import com.acadex.config.EmailService;
import com.acadex.config.FileStorageService;
import com.acadex.dto.ProfileDto;
import com.acadex.dto.UpdateProfileDto;
import com.acadex.model.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserProfileService {
    @Autowired
    private AuthRepository authRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    EmailService emailService;

//    get the user profile
    @Transactional
    public ResponseEntity<ApiResponse<ProfileDto>> getUserProfile() {
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user= authRepository.getByEmail(email);
        ProfileDto profileDto=new ProfileDto();
        profileDto.setUsername(user.getUsername());
        profileDto.setEmail(user.getEmail());
        profileDto.setName(user.getName());
        profileDto.setBio(user.getBio());
        profileDto.setMobile(user.getMobile());
        profileDto.setProfileImage(user.getProfileImage());

        return ResponseEntity.ok(ApiResponse.success("Your profile ",profileDto));
    }

//    update the user profile
    public ResponseEntity<ApiResponse<User>> updateUserProfile(UpdateProfileDto updateProfileDto)  {
        try {
            String email= SecurityContextHolder.getContext().getAuthentication().getName();
            User user= authRepository.getByEmail(email);

            Optional<User> existing =authRepository.findByUsername(updateProfileDto.getUsername());
            if(existing.isPresent() && existing.get().getId() != user.getId()) {
                return ResponseEntity.ok(ApiResponse.error("Username is already in use"));
            }
            if(updateProfileDto.getMobile()==null || updateProfileDto.getMobile().length()!= 10) {
                return ResponseEntity.ok(ApiResponse.error("Mobile number must be 10 characters"));
            }
            if (updateProfileDto.getName() == null || updateProfileDto.getName().trim().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.error("Name cannot be empty"));
            }
            if (updateProfileDto.getProfileImage() != null &&
                    !updateProfileDto.getProfileImage().isEmpty()) {

//                for local
//                String imagePath = fileStorageService.saveFile(updateProfileDto.getProfileImage(), "profile");
//                for online cloudinary
                String imagePath = cloudinaryService.uploadFile(updateProfileDto.getProfileImage(), "acadex/profile-images");

                user.setProfileImage(imagePath);
            }
            user.setUsername(updateProfileDto.getUsername());
            user.setMobile(updateProfileDto.getMobile());
            user.setBio(updateProfileDto.getBio());
            user.setName(updateProfileDto.getName());
            authRepository.save(user);
            emailService.sendProfileUpdated(user.getEmail(), user.getName());
            return ResponseEntity.ok(ApiResponse.success("Your profile updated Success ",user));
        }catch (Exception e){
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }

    }
}
