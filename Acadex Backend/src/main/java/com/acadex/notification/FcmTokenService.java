package com.acadex.notification;

import com.acadex.auth.AuthRepository;
import com.acadex.dto.FcmTokenRequest;
import com.acadex.model.FcmToken;
import com.acadex.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FcmTokenService {

    private final FcmTokenRepository fcmTokenRepository;
    private final AuthRepository userRepository;

    public void registerToken(String email, FcmTokenRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FcmToken fcmToken = fcmTokenRepository.findByToken(request.getToken())
                .orElse(new FcmToken());

        fcmToken.setToken(request.getToken());
        fcmToken.setDevice(request.getDevice());
        fcmToken.setUser(user);

        fcmTokenRepository.save(fcmToken);
    }

    public void unregisterToken(String token) {
        fcmTokenRepository.deleteByToken(token);
    }

    public List<FcmToken> getUserTokens(User user) {
        return fcmTokenRepository.findByUser(user);
    }
}