package com.arya.crimeportal.enums;

public enum UserRole {
    ADMIN("Admin"),
    OFFICER("Officer"),
    USER("User");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static UserRole fromString(String role) {
        if (role == null) return USER;
        for (UserRole ur : UserRole.values()) {
            if (ur.name().equalsIgnoreCase(role) || ur.displayName.equalsIgnoreCase(role)) {
                return ur;
            }
        }
        return USER;
    }
}
