package com.acadex.notification;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    public String sendNotification(String token, String title, String body) {

        try {

            Message message = Message.builder()
                    .setToken(token)
                    .putData("title", title)
                    .putData("body", body)
                    .putData("icon", "/notification-icon.png")
                    .putData("url", "/")
                    .build();

            return FirebaseMessaging.getInstance().send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }
}