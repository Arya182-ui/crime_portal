package com.arya.crimeportal.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DashboardController {

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Fetch all collections
        ApiFuture<QuerySnapshot> crimesFuture = db.collection("crimes").get();
        ApiFuture<QuerySnapshot> firsFuture = db.collection("firs").get();
        ApiFuture<QuerySnapshot> criminalsFuture = db.collection("criminals").get();
        ApiFuture<QuerySnapshot> usersFuture = db.collection("users").get();

        List<QueryDocumentSnapshot> crimesDocs = crimesFuture.get().getDocuments();
        List<QueryDocumentSnapshot> firsDocs = firsFuture.get().getDocuments();
        List<QueryDocumentSnapshot> criminalsDocs = criminalsFuture.get().getDocuments();
        List<QueryDocumentSnapshot> usersDocs = usersFuture.get().getDocuments();

        // Calculate basic counts
        int totalCrimes = crimesDocs.size();
        int openFirs = (int) firsDocs.stream()
                .filter(d -> {
                    String status = d.getString("status");
                    return status == null || !status.equals("CLOSED");
                })
                .count();
        int knownCriminals = criminalsDocs.size();
        int users = usersDocs.size();

        // Calculate deltas (last 7 days vs previous 7 days)
        Map<String, Object> deltas = calculateDeltas(crimesDocs, firsDocs, criminalsDocs);

        // Crime trend data (last 30 days)
        List<Map<String, Object>> crimeTrend = calculateCrimeTrend(crimesDocs, 30);

        // Status breakdown
        Map<String, Integer> crimeStatusBreakdown = calculateStatusBreakdown(crimesDocs);
        Map<String, Integer> firStatusBreakdown = calculateStatusBreakdown(firsDocs);

        // Category breakdown
        Map<String, Integer> crimeCategoryBreakdown = calculateCategoryBreakdown(crimesDocs);

        // Severity breakdown
        Map<String, Integer> severityBreakdown = calculateSeverityBreakdown(crimesDocs);

        // Compose response
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCrimes", totalCrimes);
        stats.put("openFirs", openFirs);
        stats.put("knownCriminals", knownCriminals);
        stats.put("users", users);
        stats.put("deltas", deltas);
        stats.put("crimeTrend", crimeTrend);
        stats.put("crimeStatusBreakdown", crimeStatusBreakdown);
        stats.put("firStatusBreakdown", firStatusBreakdown);
        stats.put("crimeCategoryBreakdown", crimeCategoryBreakdown);
        stats.put("severityBreakdown", severityBreakdown);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<?> getRecentActivity(@RequestParam(defaultValue = "10") int limit) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        
        ApiFuture<QuerySnapshot> future = db.collection("activities")
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .limit(limit)
                .get();
        
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        List<Map<String, Object>> activities = new ArrayList<>();
        
        for (QueryDocumentSnapshot doc : docs) {
            Map<String, Object> activity = doc.getData();
            activity.put("activityId", doc.getId());
            activities.add(activity);
        }

        return ResponseEntity.ok(activities);
    }

    @GetMapping("/charts/monthly")
    public ResponseEntity<?> getMonthlyChartData() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        
        // Fetch all collections in parallel
        ApiFuture<QuerySnapshot> crimesFuture = db.collection("crimes").get();
        ApiFuture<QuerySnapshot> firsFuture = db.collection("firs").get();
        ApiFuture<QuerySnapshot> criminalsFuture = db.collection("criminals").get();

        List<QueryDocumentSnapshot> crimesDocs = crimesFuture.get().getDocuments();
        List<QueryDocumentSnapshot> firsDocs = firsFuture.get().getDocuments();
        List<QueryDocumentSnapshot> criminalsDocs = criminalsFuture.get().getDocuments();

        // Calculate monthly trends for each collection
        List<Map<String, Object>> monthlyData = calculateMonthlyTrends(crimesDocs, firsDocs, criminalsDocs, 6);
        return ResponseEntity.ok(monthlyData);
    }

    @GetMapping("/top-locations")
    public ResponseEntity<?> getTopLocations(@RequestParam(defaultValue = "5") int limit) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("crimes").get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        Map<String, Integer> locationCounts = new HashMap<>();
        for (QueryDocumentSnapshot doc : docs) {
            String location = doc.getString("location");
            if (location != null && !location.isEmpty()) {
                locationCounts.put(location, locationCounts.getOrDefault(location, 0) + 1);
            }
        }

        List<Map<String, Object>> topLocations = locationCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(e -> {
                    Map<String, Object> loc = new HashMap<>();
                    loc.put("location", e.getKey());
                    loc.put("count", e.getValue());
                    return loc;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(topLocations);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Quick summary for overview cards
        ApiFuture<QuerySnapshot> crimesFuture = db.collection("crimes").get();
        ApiFuture<QuerySnapshot> firsFuture = db.collection("firs").get();
        ApiFuture<QuerySnapshot> criminalsFuture = db.collection("criminals").get();

        int totalCrimes = crimesFuture.get().getDocuments().size();
        int activeFirs = (int) firsFuture.get().getDocuments().stream()
                .filter(d -> !"CLOSED".equals(d.getString("status")))
                .count();
        int activeCriminals = (int) criminalsFuture.get().getDocuments().stream()
                .filter(d -> {
                    String status = d.getString("status");
                    return "AT_LARGE".equals(status) || "WANTED".equals(status);
                })
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCrimes", totalCrimes);
        summary.put("activeFirs", activeFirs);
        summary.put("activeCriminals", activeCriminals);
        summary.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(summary);
    }

    // Helper methods
    private Map<String, Object> calculateDeltas(List<QueryDocumentSnapshot> crimes, 
                                                List<QueryDocumentSnapshot> firs,
                                                List<QueryDocumentSnapshot> criminals) {
        Instant now = Instant.now();
        Instant weekAgo = now.minusSeconds(7 * 86400);
        Instant twoWeeksAgo = now.minusSeconds(14 * 86400);

        int crimesLastWeek = countItemsInRange(crimes, "createdAt", weekAgo, now);
        int crimesPrevWeek = countItemsInRange(crimes, "createdAt", twoWeeksAgo, weekAgo);
        
        int firsLastWeek = countItemsInRange(firs, "createdAt", weekAgo, now);
        int firsPrevWeek = countItemsInRange(firs, "createdAt", twoWeeksAgo, weekAgo);

        Map<String, Object> deltas = new HashMap<>();
        deltas.put("crimes", calculatePercent(crimesLastWeek, crimesPrevWeek));
        deltas.put("firs", calculatePercent(firsLastWeek, firsPrevWeek));
        deltas.put("criminals", 0); // Can be enhanced with date tracking

        return deltas;
    }

    private int countItemsInRange(List<QueryDocumentSnapshot> docs, String field, Instant start, Instant end) {
        return (int) docs.stream().filter(d -> {
            Object dateObj = d.get(field);
            if (dateObj == null) return false;
            try {
                Instant date = Instant.parse(dateObj.toString());
                return date.isAfter(start) && date.isBefore(end);
            } catch (Exception e) {
                return false;
            }
        }).count();
    }

    private double calculatePercent(int current, int previous) {
        if (previous == 0) return current > 0 ? 100.0 : 0.0;
        return ((current - previous) / (double) previous) * 100.0;
    }

    private List<Map<String, Object>> calculateCrimeTrend(List<QueryDocumentSnapshot> docs, int days) {
        Map<String, Integer> dailyCounts = new LinkedHashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                .withZone(ZoneId.systemDefault());
        Instant now = Instant.now();

        for (int i = days - 1; i >= 0; i--) {
            Instant day = now.minusSeconds(86400L * i);
            dailyCounts.put(fmt.format(day), 0);
        }

        for (QueryDocumentSnapshot d : docs) {
            Object dateObj = d.get("createdAt");
            if (dateObj != null) {
                try {
                    Instant date = Instant.parse(dateObj.toString());
                    String key = fmt.format(date);
                    if (dailyCounts.containsKey(key)) {
                        dailyCounts.put(key, dailyCounts.get(key) + 1);
                    }
                } catch (Exception ignored) {}
            }
        }

        List<Map<String, Object>> trend = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : dailyCounts.entrySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", entry.getKey());
            point.put("count", entry.getValue());
            trend.add(point);
        }

        return trend;
    }

    private List<Map<String, Object>> calculateMonthlyData(List<QueryDocumentSnapshot> docs, int months) {
        Map<String, Integer> monthlyCounts = new LinkedHashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM")
                .withZone(ZoneId.systemDefault());
        Instant now = Instant.now();

        for (int i = months - 1; i >= 0; i--) {
            Instant month = now.minusSeconds(30L * 86400L * i);
            monthlyCounts.put(fmt.format(month), 0);
        }

        for (QueryDocumentSnapshot d : docs) {
            Object dateObj = d.get("createdAt");
            if (dateObj != null) {
                try {
                    Instant date = Instant.parse(dateObj.toString());
                    String key = fmt.format(date);
                    if (monthlyCounts.containsKey(key)) {
                        monthlyCounts.put(key, monthlyCounts.get(key) + 1);
                    }
                } catch (Exception ignored) {}
            }
        }

        List<Map<String, Object>> data = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : monthlyCounts.entrySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", entry.getKey());
            point.put("count", entry.getValue());
            data.add(point);
        }

        return data;
    }

    private List<Map<String, Object>> calculateMonthlyTrends(List<QueryDocumentSnapshot> crimesDocs, 
                                                              List<QueryDocumentSnapshot> firsDocs,
                                                              List<QueryDocumentSnapshot> criminalsDocs,
                                                              int months) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM")
                .withZone(ZoneId.systemDefault());
        Instant now = Instant.now();

        // Initialize month map with all months in the range
        Map<String, Map<String, Integer>> monthlyData = new LinkedHashMap<>();
        for (int i = months - 1; i >= 0; i--) {
            Instant month = now.minusSeconds(30L * 86400L * i);
            String monthKey = fmt.format(month);
            Map<String, Integer> counts = new HashMap<>();
            counts.put("crimes", 0);
            counts.put("firs", 0);
            counts.put("criminals", 0);
            monthlyData.put(monthKey, counts);
        }

        // Count crimes per month
        for (QueryDocumentSnapshot doc : crimesDocs) {
            Object dateObj = doc.get("createdAt");
            if (dateObj != null) {
                try {
                    Instant date = Instant.parse(dateObj.toString());
                    String monthKey = fmt.format(date);
                    if (monthlyData.containsKey(monthKey)) {
                        monthlyData.get(monthKey).put("crimes", 
                            monthlyData.get(monthKey).get("crimes") + 1);
                    }
                } catch (Exception ignored) {}
            }
        }

        // Count FIRs per month
        for (QueryDocumentSnapshot doc : firsDocs) {
            Object dateObj = doc.get("createdAt");
            if (dateObj != null) {
                try {
                    Instant date = Instant.parse(dateObj.toString());
                    String monthKey = fmt.format(date);
                    if (monthlyData.containsKey(monthKey)) {
                        monthlyData.get(monthKey).put("firs", 
                            monthlyData.get(monthKey).get("firs") + 1);
                    }
                } catch (Exception ignored) {}
            }
        }

        // Count criminals per month
        for (QueryDocumentSnapshot doc : criminalsDocs) {
            Object dateObj = doc.get("createdAt");
            if (dateObj != null) {
                try {
                    Instant date = Instant.parse(dateObj.toString());
                    String monthKey = fmt.format(date);
                    if (monthlyData.containsKey(monthKey)) {
                        monthlyData.get(monthKey).put("criminals", 
                            monthlyData.get(monthKey).get("criminals") + 1);
                    }
                } catch (Exception ignored) {}
            }
        }

        // Convert to list format
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Map<String, Integer>> entry : monthlyData.entrySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", entry.getKey());
            point.put("crimes", entry.getValue().get("crimes"));
            point.put("firs", entry.getValue().get("firs"));
            point.put("criminals", entry.getValue().get("criminals"));
            result.add(point);
        }

        return result;
    }

    private Map<String, Integer> calculateStatusBreakdown(List<QueryDocumentSnapshot> docs) {
        Map<String, Integer> breakdown = new HashMap<>();
        for (QueryDocumentSnapshot doc : docs) {
            String status = doc.getString("status");
            if (status != null) {
                breakdown.put(status, breakdown.getOrDefault(status, 0) + 1);
            }
        }
        return breakdown;
    }

    private Map<String, Integer> calculateCategoryBreakdown(List<QueryDocumentSnapshot> docs) {
        Map<String, Integer> breakdown = new HashMap<>();
        for (QueryDocumentSnapshot doc : docs) {
            String category = doc.getString("category");
            if (category != null) {
                breakdown.put(category, breakdown.getOrDefault(category, 0) + 1);
            }
        }
        return breakdown;
    }

    private Map<String, Integer> calculateSeverityBreakdown(List<QueryDocumentSnapshot> docs) {
        Map<String, Integer> breakdown = new HashMap<>();
        for (QueryDocumentSnapshot doc : docs) {
            String severity = doc.getString("severity");
            if (severity != null) {
                breakdown.put(severity, breakdown.getOrDefault(severity, 0) + 1);
            }
        }
        return breakdown;
    }
}
