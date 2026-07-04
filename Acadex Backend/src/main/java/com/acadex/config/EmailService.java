package com.acadex.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

//    public  void sendEmail(String toEmail, String subject, String body){
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject(subject);
//        message.setText(body);
//        mailSender.send(message);
//    }

    @Value("${BREVO_API_KEY}")
    private String API_KEY;

    private void sendEmail(String toEmail, String subject, String body) {

        try {

            String url = "https://api.brevo.com/v3/smtp/email";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("accept", "application/json");
            headers.set("api-key", API_KEY);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();

            Map<String, String> sender = new HashMap<>();
            sender.put("name", "Acadex");
            sender.put("email", "harshalmulay1039@gmail.com");

            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", toEmail);

            requestBody.put("sender", sender);
            requestBody.put("to", new Object[]{recipient});
            requestBody.put("subject", subject);
            requestBody.put("htmlContent", body.replace("\n", "<br>"));

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(requestBody, headers);

            restTemplate.postForEntity(url, request, String.class);

            System.out.println("Email sent successfully to: " + toEmail);

        } catch (Exception e) {
            System.out.println("Failed to send email to: " + toEmail);
            e.printStackTrace();

        }
    }


    public void sendOtp(String toEmail, String otp){
        String subject = "Acadex - Email Verification OTP";
        String body = "Your OTP for Acadex verification is: " + otp + "\n\nThis OTP expires in 5 minutes.\n\nTeam Acadex";
        sendEmail(toEmail, subject, body);
    }

    @Async
    public void sendWelcome(String toEmail, String name) {
        String subject = "Welcome to Acadex!";
        String body = "Hi " + name + ",\n\nWelcome to Acadex! Your account has been verified successfully.\n\nStart sharing your knowledge today!\n\nTeam Acadex";
        sendEmail(toEmail, subject, body);
    }

    public void sendPasswordReset(String toEmail, String otp) {
        String subject = "Acadex - Password Reset OTP";
        String body = "Your OTP for password reset is: " + otp + "\n\nThis OTP expires in 5 minutes.\n\nIf you didn't request this, ignore this email.\n\nTeam Acadex";
        sendEmail(toEmail, subject, body);
    }

    // ================= PROFILE UPDATED =================

    @Async
    public void sendProfileUpdated(String email, String name) {

        String subject = "Acadex - Profile Updated";

        String body =
                "<h2>Profile Updated Successfully</h2>" +
                        "<p>Hi <b>" + name + "</b>,</p>" +
                        "<p>Your Acadex profile has been updated successfully.</p>" +
                        "<p>If you did not make this change, please secure your account immediately.</p>" +
                        "<br><p>Team Acadex</p>";

        sendEmail(email, subject, body);

    }

// ================= PASSWORD RESET =================

    @Async
    public void sendPasswordResetSuccess(String email, String name) {

        String subject = "Acadex - Password Changed";

        String body =
                "<h2>Password Changed Successfully</h2>" +
                        "<p>Hi <b>" + name + "</b>,</p>" +
                        "<p>Your Acadex account password has been changed successfully.</p>" +
                        "<p>If you did not perform this action, please contact support immediately.</p>" +
                        "<br><p>Team Acadex</p>";

        sendEmail(email, subject, body);

    }

// ================= NOTE DELETED =================

    @Async
    public void sendNoteDeleted(String email, String name, String noteTitle) {

        String subject = "Acadex - Note Deleted";

        String body =
                "<h2>Note Deleted Successfully</h2>" +
                        "<p>Hi <b>" + name + "</b>,</p>" +
                        "<p>Your note has been deleted successfully.</p>" +
                        "<p><b>Note Title:</b> " + noteTitle + "</p>" +
                        "<br><p>Team Acadex</p>";

        sendEmail(email, subject, body);

    }

// ================= PROJECT DELETED =================

    @Async
    public void sendProjectDeleted(String email, String name, String projectTitle) {

        String subject = "Acadex - Project Deleted";

        String body =
                "<h2>Project Deleted Successfully</h2>" +
                        "<p>Hi <b>" + name + "</b>,</p>" +
                        "<p>Your project has been deleted successfully.</p>" +
                        "<p><b>Project Title:</b> " + projectTitle + "</p>" +
                        "<br><p>Team Acadex</p>";

        sendEmail(email, subject, body);

    }
}
