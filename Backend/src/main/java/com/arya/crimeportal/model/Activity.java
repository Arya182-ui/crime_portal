package com.arya.crimeportal.model;

import java.time.Instant;

public class Activity {
    private String activityId;
    private String userId;
    private String userName;
    private String userRole;
    private String action; // e.g., "CRIME_FILED", "FIR_UPDATED", "USER_CREATED"
    private String entityType; // "CRIME", "FIR", "CRIMINAL", "USER"
    private String entityId;
    private String description; // Human-readable description
    private Instant timestamp;
    private String ipAddress;

    public Activity() {
        this.timestamp = Instant.now();
    }

    public Activity(String userId, String userName, String userRole, String action, 
                   String entityType, String entityId, String description) {
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
        this.timestamp = Instant.now();
    }

    // Getters and Setters
    public String getActivityId() { return activityId; }
    public void setActivityId(String activityId) { this.activityId = activityId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
