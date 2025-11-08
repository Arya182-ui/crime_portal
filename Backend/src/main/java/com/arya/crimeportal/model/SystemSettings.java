package com.arya.crimeportal.model;

import java.time.Instant;

public class SystemSettings {
    private String settingId;
    private String key;
    private String value;
    private String description;
    private String category; // "GENERAL", "SECURITY", "EMAIL", "NOTIFICATIONS"
    private Instant updatedAt;
    private String updatedBy;

    public SystemSettings() {
        this.updatedAt = Instant.now();
    }

    public SystemSettings(String key, String value, String description, String category) {
        this.key = key;
        this.value = value;
        this.description = description;
        this.category = category;
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getSettingId() { return settingId; }
    public void setSettingId(String settingId) { this.settingId = settingId; }
    
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
