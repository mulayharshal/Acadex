package com.acadex.auth;

import com.acadex.common.ApiResponse;
import com.acadex.config.JwtUtil;
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


    public ResponseEntity<ApiResponse<User>>register(@RequestBody registerDto registerDto) {

        if(registerDto.getEmail() == null || registerDto.getEmail().equals("") || registerDto.getPassword() == null || registerDto.getPassword().equals("")
        || registerDto.getName().equals("") || registerDto.getName().equals("")) {

            return ResponseEntity.ok(ApiResponse.error("Data cannot be null"));
//
        }else {
            String email = registerDto.getEmail();
            String password = registerDto.getPassword();
            String name = registerDto.getName();

            Optional<User> existing = authRepository.findByEmail(registerDto.getEmail());
            if (existing.isPresent()) {
                return ResponseEntity.ok(ApiResponse.error("Email already exists"));
            }
            User newUser=new User();
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(password));
            newUser.setName(name);
            authRepository.save(newUser);

            return ResponseEntity.ok(ApiResponse.success("User registered successfully",newUser));
        }
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
        String token=jwtUtil.generateToken(email);
        return ResponseEntity.ok(ApiResponse.success("User logged successfully",token));
    }
}
