package com.arya.crimeportal.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EnvFileLoader {
    private static Map<String, String> map;

    private static synchronized void loadIfNeeded() {
        if (map != null) return;
        map = new HashMap<>();
        // Candidate locations (relative to project root)
        String[] candidates = {"Backend/.env", ".env", "./Backend/.env"};
        Path chosen = null;
        for (String c : candidates) {
            Path p = Paths.get(c);
            if (Files.exists(p)) {
                chosen = p;
                break;
            }
        }
        if (chosen == null) return;
        try {
            List<String> lines = Files.readAllLines(chosen);
            for (String raw : lines) {
                String line = raw.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;
                int idx = line.indexOf('=');
                if (idx <= 0) continue;
                String key = line.substring(0, idx).trim();
                String val = line.substring(idx + 1).trim();
                if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length() - 1);
                }
                map.put(key, val);
            }
        } catch (IOException e) {
            // ignore silently; map stays empty
        }
    }

    public static String get(String key) {
        // 1. system env
        String v = System.getenv(key);
        if (v != null && !v.isBlank()) return v;
        // 2. system properties
        v = System.getProperty(key);
        if (v != null && !v.isBlank()) return v;
        // 3. .env file
        loadIfNeeded();
        v = map.get(key);
        return v;
    }

    public static boolean getBoolean(String key, boolean defaultVal) {
        String v = get(key);
        if (v == null) return defaultVal;
        return v.equalsIgnoreCase("true") || v.equals("1") || v.equalsIgnoreCase("yes");
    }
}
