package com.acadex.auth;

import com.acadex.common.ApiResponse;
import com.acadex.config.EmailService;
import com.acadex.config.JwtUtil;
import com.acadex.config.OtpService;
import com.acadex.model.User;
import com.acadex.dto.loginDto;
import com.acadex.dto.registerDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    AuthRepository authRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    OtpService otpService;

    @Autowired
    EmailService emailService;


    public ResponseEntity<ApiResponse<?>>register(@RequestBody registerDto registerDto) {

        if(registerDto.getEmail() == null || registerDto.getEmail().equals("") || registerDto.getPassword() == null || registerDto.getPassword().equals("")
        || registerDto.getName().equals("") || registerDto.getName().equals("")) {

            return ResponseEntity.ok(ApiResponse.error("Data cannot be null"));

        }
        Optional<User> existing = authRepository.findByEmail(registerDto.getEmail());
        if(existing.isPresent()) {
            if(!existing.get().isVerified()){
                User unverifiedUser = existing.get();
                unverifiedUser.setPassword(passwordEncoder.encode(registerDto.getPassword()));
                unverifiedUser.setName(registerDto.getName());
                authRepository.save(unverifiedUser);

                String otp = otpService.generateOtp(registerDto.getEmail());
                emailService.sendOtp(registerDto.getEmail(), otp);
                return ResponseEntity.ok(ApiResponse.success("Otp resent to Your email", "Please verify your email"));

            }
            return ResponseEntity.ok(ApiResponse.error("Email already in use"));
        }

        User newUser = new User();
        newUser.setEmail(registerDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        newUser.setName(registerDto.getName());
        newUser.setVerified(false);
        authRepository.save(newUser);

        String otp = otpService.generateOtp(registerDto.getEmail());
        emailService.sendOtp(registerDto.getEmail(), otp);
        return  ResponseEntity.ok(ApiResponse.success("OTP sent to Your email", "Please verify your email"));



    }

    public ResponseEntity<ApiResponse<String>> login(loginDto loginDto) {
        String email = loginDto.getEmail();
        String password = loginDto.getPassword();
        if( email == null || email.equals("") || password == null || password.equals("")) {
            return ResponseEntity.ok(ApiResponse.error("Data cannot be null"));
        }

        Optional<User> userOptional = authRepository.findByEmail(email);
        if(userOptional.isEmpty()){
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        }
        User user = userOptional.get();

        if(!passwordEncoder.matches(password, user.getPassword())){
            return ResponseEntity.ok(ApiResponse.error("Wrong password"));

        }

        if(!user.isVerified()){
            String otp = otpService.generateOtp(email);
            emailService.sendOtp(email, otp);
            return ResponseEntity.ok(ApiResponse.error("Email is not verified. OTP resent to your email"));
        }

        String token=jwtUtil.generateToken(email);
        return ResponseEntity.ok(ApiResponse.success("User logged successfully",token));
    }


    public ResponseEntity<ApiResponse<String>> verifyOtp(String email,String otp) {
        boolean isVerified = otpService.verifyOtp(email,otp);

        if(!isVerified){
            return ResponseEntity.ok(ApiResponse.error("Invalid or expired OTP"));
        }

        User user = authRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        }

        user.setVerified(true);
        authRepository.save(user);

        emailService.sendWelcome(user.getEmail(),user.getName());

        String token=jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(ApiResponse.success("User logged successfully",token));
    }


    public ResponseEntity<ApiResponse<String>> forgotPassword(String email) {
        User user = authRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        }
        String otp = otpService.generateOtp(email);
        emailService.sendPasswordReset(email, otp);
        return ResponseEntity.ok(ApiResponse.success("OTP sent to your email", "Please check your email"));
    }

    public ResponseEntity<ApiResponse<String>> resetPassword(String email, String otp, String newPassword) {
        boolean isValid = otpService.verifyOtp(email, otp);
        if (!isValid) {
            return ResponseEntity.ok(ApiResponse.error("Invalid or expired OTP"));
        }
        User user = authRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        authRepository.save(user);
        emailService.sendPasswordReset(email, user.getName());
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", "Please login with new password"));
    }

}
