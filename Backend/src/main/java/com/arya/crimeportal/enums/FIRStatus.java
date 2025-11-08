package com.arya.crimeportal.enums;

public enum FIRStatus {
    PENDING("Pending Review"),
    REGISTERED("Registered"),
    INVESTIGATING("Under Investigation"),
    EVIDENCE_COLLECTED("Evidence Collected"),
    CHARGE_SHEET_FILED("Charge Sheet Filed"),
    CLOSED("Closed");

    private final String displayName;

    FIRStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static FIRStatus fromString(String status) {
        if (status == null) return PENDING;
        for (FIRStatus fs : FIRStatus.values()) {
            if (fs.name().equalsIgnoreCase(status) || fs.displayName.equalsIgnoreCase(status)) {
                return fs;
            }
        }
        return PENDING;
    }
}
