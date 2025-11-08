package com.arya.crimeportal.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() throws Exception {
        if (FirebaseApp.getApps().isEmpty()) {
            String firebaseServiceAccount = null;
            
            // Priority 1: System environment variable (Railway, Heroku, etc.)
            firebaseServiceAccount = System.getenv("FIREBASE_SERVICE_ACCOUNT");
            
            // Priority 2: .env file loader (local development)
            if (firebaseServiceAccount == null || firebaseServiceAccount.isBlank()) {
                firebaseServiceAccount = EnvFileLoader.get("FIREBASE_SERVICE_ACCOUNT");
            }
            
            // Priority 3: File path based (local development)
            if (firebaseServiceAccount == null || firebaseServiceAccount.isBlank()) {
                String path = System.getenv("FIREBASE_SERVICE_ACCOUNT_PATH");
                if (path == null || path.isBlank()) {
                    path = EnvFileLoader.get("FIREBASE_SERVICE_ACCOUNT_PATH");
                }
                
                if (path != null && !path.isBlank()) {
                    Path p = Paths.get(path);
                    if (!p.isAbsolute()) {
                        p = Paths.get("").resolve(path);
                    }
                    if (Files.exists(p)) {
                        firebaseServiceAccount = Files.readString(p);
                    }
                }
            }

            if (firebaseServiceAccount == null || firebaseServiceAccount.isBlank()) {
                throw new IllegalStateException(
                    "FIREBASE_SERVICE_ACCOUNT environment variable is required. " +
                    "Set it in Railway/Heroku or provide FIREBASE_SERVICE_ACCOUNT_PATH for local dev."
                );
            }

            // Initialize Firebase
            InputStream serviceAccount = new ByteArrayInputStream(
                firebaseServiceAccount.getBytes(StandardCharsets.UTF_8)
            );
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
            
            System.out.println("✅ Firebase initialized successfully!");
        }
    }
}
