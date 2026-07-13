package com.acadex.notification;

import com.acadex.common.ApiResponse;
import com.acadex.model.FcmToken;
import com.acadex.model.User;
import com.acadex.auth.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fcm")
@RequiredArgsConstructor
public class TestNotificationController {

    private final NotificationService notificationService;
    private final FcmTokenService fcmTokenService;
    private final AuthRepository authRepository;

    @PostMapping("/test")
    public ApiResponse<?> sendTestNotification(Authentication authentication) {

        String email = authentication.getName();

        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FcmToken> tokens = fcmTokenService.getUserTokens(user);

        if (tokens.isEmpty()) {
            return ApiResponse.error("No FCM token found for this user.");
        }

        for (FcmToken token : tokens) {

            notificationService.sendNotification(
                    token.getToken(),
                    "🎉 Acadex Notification",
                    "Congratulations! Firebase Cloud Messaging is working successfully."
            );

        }

        return ApiResponse.success(
                "Notification sent successfully.",
                null
        );
    }
}
