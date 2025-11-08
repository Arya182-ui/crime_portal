package com.arya.crimeportal.security;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class FirebaseAuthenticationToken implements Authentication {
    private final FirebaseToken token;
    private boolean authenticated = true;

    public FirebaseAuthenticationToken(FirebaseToken token) {
        this.token = token;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null; // For simplicity: authorities can be assigned from token claims like role
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getDetails() {
        return token.getClaims();
    }

    @Override
    public Object getPrincipal() {
        return token.getUid();
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        return token.getName();
    }
}
