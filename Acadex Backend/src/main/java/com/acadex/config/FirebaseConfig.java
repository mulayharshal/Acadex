package com.acadex.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.type}")
    private String type;

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.private-key-id}")
    private String privateKeyId;

    @Value("${firebase.private-key}")
    private String privateKey;

    @Value("${firebase.client-email}")
    private String clientEmail;

    @Value("${firebase.client-id}")
    private String clientId;

    @Value("${firebase.auth-uri}")
    private String authUri;

    @Value("${firebase.token-uri}")
    private String tokenUri;

    @Value("${firebase.auth-provider-cert-url}")
    private String authProviderCertUrl;

    @Value("${firebase.client-cert-url}")
    private String clientCertUrl;

    @PostConstruct
    public void initialize() {

        try {

            String firebaseJson = String.format("""
                    {
                      "type": "%s",
                      "project_id": "%s",
                      "private_key_id": "%s",
                      "private_key": "%s",
                      "client_email": "%s",
                      "client_id": "%s",
                      "auth_uri": "%s",
                      "token_uri": "%s",
                      "auth_provider_x509_cert_url": "%s",
                      "client_x509_cert_url": "%s"
                    }
                    """,
                    type,
                    projectId,
                    privateKeyId,
                    privateKey.replace("\\n", "\n"),
                    clientEmail,
                    clientId,
                    authUri,
                    tokenUri,
                    authProviderCertUrl,
                    clientCertUrl
            );

            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new ByteArrayInputStream(firebaseJson.getBytes(StandardCharsets.UTF_8))
            );

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase Admin Initialized Successfully");
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Firebase", e);
        }
    }
}