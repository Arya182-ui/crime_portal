package com.arya.crimeportal.enums;

public enum CrimeStatus {
    REPORTED("Reported"),
    INVESTIGATING("Under Investigation"),
    SOLVED("Solved"),
    CLOSED("Closed"),
    COLD_CASE("Cold Case");

    private final String displayName;

    CrimeStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CrimeStatus fromString(String status) {
        if (status == null) return REPORTED;
        for (CrimeStatus cs : CrimeStatus.values()) {
            if (cs.name().equalsIgnoreCase(status) || cs.displayName.equalsIgnoreCase(status)) {
                return cs;
            }
        }
        return REPORTED;
    }
}
