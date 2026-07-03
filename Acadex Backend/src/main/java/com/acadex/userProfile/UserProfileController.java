package com.acadex.userProfile;

import com.acadex.common.ApiResponse;
import com.acadex.dto.ProfileDto;
import com.acadex.dto.UpdateProfileDto;
import com.acadex.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

//    get the user profile
    @GetMapping
    public ResponseEntity<ApiResponse<ProfileDto>> getUserProfile() {
        return userProfileService.getUserProfile();
    }

//    update the profile
@PatchMapping(
        value = "/update",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
    public ResponseEntity<ApiResponse<User>>  updateUserProfile(@ModelAttribute  UpdateProfileDto updateProfileDto) {
        return userProfileService.updateUserProfile(updateProfileDto);
    }
}
