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

    @Value("${FIREBASE_SERVICE_ACCOUNT:}")
    private String firebaseServiceAccount; // JSON content of service account as env var

    @PostConstruct
    public void init() throws Exception {
        if (FirebaseApp.getApps().isEmpty()) {
            // Try system/env var first (injected), then fallback to .env file or a path variable
            if (firebaseServiceAccount == null || firebaseServiceAccount.isBlank()) {
                String fromEnvFile = EnvFileLoader.get("FIREBASE_SERVICE_ACCOUNT");
                if (fromEnvFile != null && !fromEnvFile.isBlank()) {
                    firebaseServiceAccount = fromEnvFile;
                } else {
                    String path = EnvFileLoader.get("FIREBASE_SERVICE_ACCOUNT_PATH");
                    if (path != null && !path.isBlank()) {
                        Path p = Paths.get(path);
                        if (!p.isAbsolute()) p = Paths.get("").resolve(path);
                        firebaseServiceAccount = Files.readString(p);
                    }
                }
            }

            if (firebaseServiceAccount == null || firebaseServiceAccount.isBlank()) {
                throw new IllegalStateException("FIREBASE_SERVICE_ACCOUNT environment variable is required");
            }

            InputStream serviceAccount = new ByteArrayInputStream(firebaseServiceAccount.getBytes(StandardCharsets.UTF_8));
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
        }
    }
}
