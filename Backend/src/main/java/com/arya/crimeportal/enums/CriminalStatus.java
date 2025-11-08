package com.arya.crimeportal.enums;

public enum CriminalStatus {
    AT_LARGE("At Large"),
    ARRESTED("Arrested"),
    IN_CUSTODY("In Custody"),
    CONVICTED("Convicted"),
    RELEASED("Released"),
    WANTED("Wanted");

    private final String displayName;

    CriminalStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CriminalStatus fromString(String status) {
        if (status == null) return AT_LARGE;
        for (CriminalStatus cs : CriminalStatus.values()) {
            if (cs.name().equalsIgnoreCase(status) || cs.displayName.equalsIgnoreCase(status)) {
                return cs;
            }
        }
        return AT_LARGE;
    }
}
