package com.arya.crimeportal.util;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;

public class SecurityUtil {
    public static FirebaseToken getFirebaseToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getCredentials() instanceof FirebaseToken) {
            return (FirebaseToken) auth.getCredentials();
        }
        return null;
    }

    public static String getUid() {
        FirebaseToken token = getFirebaseToken();
        return token == null ? null : token.getUid();
    }

    @SuppressWarnings("unchecked")
    public static String getRole() {
        FirebaseToken token = getFirebaseToken();
        if (token == null) return null;
        Map<String, Object> claims = token.getClaims();
        Object role = claims.get("role");
        return role == null ? null : role.toString();
    }

    public static String getName() {
        FirebaseToken token = getFirebaseToken();
        if (token == null) return null;
        
        // Try to get name from token claims
        Map<String, Object> claims = token.getClaims();
        Object name = claims.get("name");
        if (name != null) {
            return name.toString();
        }
        
        // Fallback to email if name is not available
        String email = token.getEmail();
        if (email != null) {
            return email;
        }
        
        // Last fallback to UID
        return token.getUid();
    }

    public static String getEmail() {
        FirebaseToken token = getFirebaseToken();
        return token == null ? null : token.getEmail();
    }
}
