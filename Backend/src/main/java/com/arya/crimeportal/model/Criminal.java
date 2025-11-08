package com.arya.crimeportal.model;

import java.time.Instant;
import java.util.List;

public class Criminal {
    private String criminalId;
    private String name;
    private String alias; // Known aliases
    private String gender;
    private Integer age;
    private String status; // AT_LARGE, ARRESTED, IN_CUSTODY, CONVICTED, RELEASED, WANTED
    private String crimeId;
    private List<String> crimeIds; // Multiple crimes
    private String photoUrl;
    private String address;
    private String identificationMarks;
    private String dangerLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private Instant lastSeenDate;
    private String lastSeenLocation;
    private Instant createdAt;
    private Instant updatedAt;

    public Criminal() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = "AT_LARGE";
    }

    public String getCriminalId() { return criminalId; }
    public void setCriminalId(String criminalId) { this.criminalId = criminalId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getCrimeId() { return crimeId; }
    public void setCrimeId(String crimeId) { this.crimeId = crimeId; }
    
    public List<String> getCrimeIds() { return crimeIds; }
    public void setCrimeIds(List<String> crimeIds) { this.crimeIds = crimeIds; }
    
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getIdentificationMarks() { return identificationMarks; }
    public void setIdentificationMarks(String identificationMarks) { this.identificationMarks = identificationMarks; }
    
    public String getDangerLevel() { return dangerLevel; }
    public void setDangerLevel(String dangerLevel) { this.dangerLevel = dangerLevel; }
    
    public Instant getLastSeenDate() { return lastSeenDate; }
    public void setLastSeenDate(Instant lastSeenDate) { this.lastSeenDate = lastSeenDate; }
    
    public String getLastSeenLocation() { return lastSeenLocation; }
    public void setLastSeenLocation(String lastSeenLocation) { this.lastSeenLocation = lastSeenLocation; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
