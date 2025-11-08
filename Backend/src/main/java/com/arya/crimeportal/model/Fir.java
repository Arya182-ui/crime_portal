package com.arya.crimeportal.model;

import java.time.Instant;

public class Fir {
    private String firId;
    private String firNumber; // Unique FIR reference number
    private String complainantName;
    private String contact;
    private String details;
    private String incidentLocation;
    private Instant incidentDate;
    private String crimeId;
    private String status; // PENDING, REGISTERED, INVESTIGATING, EVIDENCE_COLLECTED, CHARGE_SHEET_FILED, CLOSED
    private String officerId; // Assigned investigating officer
    private String officerName;
    private String userId; // User who filed FIR
    private Instant createdAt;
    private Instant updatedAt;

    public Fir() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = "PENDING";
    }

    public String getFirId() { return firId; }
    public void setFirId(String firId) { this.firId = firId; }
    
    public String getFirNumber() { return firNumber; }
    public void setFirNumber(String firNumber) { this.firNumber = firNumber; }
    
    public String getComplainantName() { return complainantName; }
    public void setComplainantName(String complainantName) { this.complainantName = complainantName; }
    
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    
    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }
    
    public Instant getIncidentDate() { return incidentDate; }
    public void setIncidentDate(Instant incidentDate) { this.incidentDate = incidentDate; }
    
    public String getCrimeId() { return crimeId; }
    public void setCrimeId(String crimeId) { this.crimeId = crimeId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getOfficerId() { return officerId; }
    public void setOfficerId(String officerId) { this.officerId = officerId; }
    
    public String getOfficerName() { return officerName; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
