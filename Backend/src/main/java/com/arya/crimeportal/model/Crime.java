package com.arya.crimeportal.model;

import java.time.Instant;

public class Crime {
    private String crimeId;
    private String title;
    private String description;
    private Instant date;
    private String location;
    private String officerId;
    private String status; // REPORTED, INVESTIGATING, SOLVED, CLOSED, COLD_CASE
    private String category; // THEFT, ROBBERY, ASSAULT, MURDER, FRAUD, etc.
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private String reportedBy; // User ID who reported
    private String reportedByName; // User name
    private Instant createdAt;
    private Instant updatedAt;

    public Crime() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = "REPORTED";
    }

    // getters/setters
    public String getCrimeId() { return crimeId; }
    public void setCrimeId(String crimeId) { this.crimeId = crimeId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Instant getDate() { return date; }
    public void setDate(Instant date) { this.date = date; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getOfficerId() { return officerId; }
    public void setOfficerId(String officerId) { this.officerId = officerId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    
    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }
    
    public String getReportedByName() { return reportedByName; }
    public void setReportedByName(String reportedByName) { this.reportedByName = reportedByName; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
