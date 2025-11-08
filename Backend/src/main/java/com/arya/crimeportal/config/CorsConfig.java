package com.arya.crimeportal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Value("${ALLOW_ALL_CORS_DEV:false}")
    private boolean allowAllCorsDev;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Allow values from .env file to override injected properties
        String effectiveFrontend = EnvFileLoader.get("FRONTEND_URL");
        if (effectiveFrontend == null || effectiveFrontend.isBlank()) {
            effectiveFrontend = frontendUrl;
        }
        boolean effectiveAllowAll = EnvFileLoader.getBoolean("ALLOW_ALL_CORS_DEV", allowAllCorsDev);

        if (effectiveAllowAll) {
            // Development helper: allow any origin (use only for local/dev testing)
            config.setAllowedOriginPatterns(List.of("*"));
        } else {
            List<String> origins = Arrays.stream(effectiveFrontend.split(",")).map(String::trim).collect(Collectors.toList());
            config.setAllowedOrigins(origins);
        }
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    // Provide CorsConfigurationSource so Spring Security can use it when http.cors() is enabled
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        String effectiveFrontend = EnvFileLoader.get("FRONTEND_URL");
        if (effectiveFrontend == null || effectiveFrontend.isBlank()) {
            effectiveFrontend = frontendUrl;
        }
        boolean effectiveAllowAll = EnvFileLoader.getBoolean("ALLOW_ALL_CORS_DEV", allowAllCorsDev);

        if (effectiveAllowAll) {
            config.setAllowedOriginPatterns(List.of("*"));
        } else {
            List<String> origins = Arrays.stream(effectiveFrontend.split(",")).map(String::trim).collect(Collectors.toList());
            config.setAllowedOrigins(origins);
        }
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
