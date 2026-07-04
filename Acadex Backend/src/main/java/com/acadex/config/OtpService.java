package com.acadex.config;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> otpExpiry = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        otpStore.put(email, otp);
        otpExpiry.put(email, LocalDateTime.now().plusMinutes(5));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        if (!otpStore.containsKey(email)) return false;
        if (LocalDateTime.now().isAfter(otpExpiry.get(email))) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            return false;
        }
        if (otpStore.get(email).equals(otp)) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            return true;
        }
        return false;
    }
}