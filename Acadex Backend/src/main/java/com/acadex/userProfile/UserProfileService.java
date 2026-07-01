package com.acadex.userProfile;

import com.acadex.auth.AuthRepository;
import com.acadex.common.ApiResponse;
import com.acadex.dto.ProfileDto;
import com.acadex.dto.UpdateProfileDto;
import com.acadex.model.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {
    @Autowired
    private AuthRepository authRepository;

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

        return ResponseEntity.ok(ApiResponse.success("Your profile ",profileDto));
    }

//    update the user profile
    public ResponseEntity<ApiResponse<User>> updateUserProfile(UpdateProfileDto updateProfileDto) {
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user= authRepository.getByEmail(email);

        Optional<User> existing =authRepository.findByUsername(updateProfileDto.getUsername());
        if(existing.isPresent() && existing.get().getId() != user.getId()) {
            return ResponseEntity.ok(ApiResponse.error("Username is already in use"));
        }
        if(updateProfileDto.getMobile()==null || updateProfileDto.getMobile().length()!= 10) {
            return ResponseEntity.ok(ApiResponse.error("Mobile number must be 10 characters"));
        }
        if(updateProfileDto.getName()==null && updateProfileDto.getName().equals("")) {
            return ResponseEntity.ok(ApiResponse.error("Name cannot be empty"));
        }
        user.setUsername(updateProfileDto.getUsername());
        user.setMobile(updateProfileDto.getMobile());
        user.setBio(updateProfileDto.getBio());
        user.setName(updateProfileDto.getName());
        authRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Your profile updated Success ",user));
    }
}
