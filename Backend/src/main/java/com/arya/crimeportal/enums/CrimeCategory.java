package com.arya.crimeportal.enums;

public enum CrimeCategory {
    THEFT("Theft"),
    ROBBERY("Robbery"),
    ASSAULT("Assault"),
    MURDER("Murder"),
    FRAUD("Fraud"),
    CYBERCRIME("Cybercrime"),
    DRUG_OFFENSE("Drug Offense"),
    DOMESTIC_VIOLENCE("Domestic Violence"),
    KIDNAPPING("Kidnapping"),
    VANDALISM("Vandalism"),
    OTHER("Other");

    private final String displayName;

    CrimeCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CrimeCategory fromString(String category) {
        if (category == null) return OTHER;
        for (CrimeCategory cc : CrimeCategory.values()) {
            if (cc.name().equalsIgnoreCase(category) || cc.displayName.equalsIgnoreCase(category)) {
                return cc;
            }
        }
        return OTHER;
    }
}
