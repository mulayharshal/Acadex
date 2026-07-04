package com.acadex.auth;

import com.acadex.common.ApiResponse;
import com.acadex.model.User;
import com.acadex.dto.loginDto;
import com.acadex.dto.registerDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody registerDto registerDto) {
        return authService.register(registerDto);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody loginDto loginDto) {
        return authService.login(loginDto);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        return authService.verifyOtp(email, otp);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody Map<String, String> request) {
        return authService.forgotPassword(request.get("email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody Map<String, String> request) {
        return authService.resetPassword(
                request.get("email"),
                request.get("otp"),
                request.get("newPassword")
        );
    }
}
