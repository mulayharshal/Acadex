package com.acadex.notification;


import com.acadex.common.ApiResponse;
import com.acadex.dto.FcmTokenRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fcm")
@RequiredArgsConstructor
public class FcmTokenController {

    @Autowired
    private FcmTokenService fcmTokenService;

    @PostMapping("/register")
    public ApiResponse<?> registerToken(@RequestBody FcmTokenRequest request,
                                        Authentication authentication) {

        String email = authentication.getName();

        fcmTokenService.registerToken(email, request);

        return ApiResponse.success("FCM Token Registered Successfully", null);
    }

    @DeleteMapping("/unregister")
    public ApiResponse<?> unregisterToken(@RequestParam String token) {

        fcmTokenService.unregisterToken(token);

        return ApiResponse.success("FCM Token Removed Successfully", null);
    }
}