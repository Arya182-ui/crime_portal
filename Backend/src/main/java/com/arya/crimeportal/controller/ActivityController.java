package com.arya.crimeportal.controller;

import com.arya.crimeportal.model.Activity;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ActivityController {

    @GetMapping
    public ResponseEntity<?> getRecentActivity(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String entityType
    ) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("activities")
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .limit(limit);

        if (userId != null && !userId.isEmpty()) {
            query = query.whereEqualTo("userId", userId);
        }
        if (entityType != null && !entityType.isEmpty()) {
            query = query.whereEqualTo("entityType", entityType);
        }

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<Map<String, Object>> activities = new ArrayList<>();
        for (QueryDocumentSnapshot doc : docs) {
            Map<String, Object> activity = doc.getData();
            activity.put("activityId", doc.getId());
            activities.add(activity);
        }

        return ResponseEntity.ok(activities);
    }

    @PostMapping
    public ResponseEntity<?> logActivity(@RequestBody Activity activity) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        if (activity.getTimestamp() == null) {
            activity.setTimestamp(Instant.now());
        }

        Map<String, Object> activityData = new HashMap<>();
        activityData.put("userId", activity.getUserId());
        activityData.put("userName", activity.getUserName());
        activityData.put("userRole", activity.getUserRole());
        activityData.put("action", activity.getAction());
        activityData.put("entityType", activity.getEntityType());
        activityData.put("entityId", activity.getEntityId());
        activityData.put("description", activity.getDescription());
        activityData.put("timestamp", activity.getTimestamp().toString());
        activityData.put("ipAddress", activity.getIpAddress());

        ApiFuture<DocumentReference> future = db.collection("activities").add(activityData);
        DocumentReference docRef = future.get();

        Map<String, Object> response = new HashMap<>();
        response.put("activityId", docRef.getId());
        response.put("message", "Activity logged successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getActivityStats() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("activities").get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        Map<String, Integer> actionCounts = new HashMap<>();
        Map<String, Integer> userCounts = new HashMap<>();
        Map<String, Integer> entityTypeCounts = new HashMap<>();

        for (QueryDocumentSnapshot doc : docs) {
            String action = doc.getString("action");
            String userId = doc.getString("userId");
            String entityType = doc.getString("entityType");

            if (action != null) {
                actionCounts.put(action, actionCounts.getOrDefault(action, 0) + 1);
            }
            if (userId != null) {
                userCounts.put(userId, userCounts.getOrDefault(userId, 0) + 1);
            }
            if (entityType != null) {
                entityTypeCounts.put(entityType, entityTypeCounts.getOrDefault(entityType, 0) + 1);
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalActivities", docs.size());
        stats.put("actionCounts", actionCounts);
        stats.put("topUsers", getTopEntries(userCounts, 10));
        stats.put("entityTypeCounts", entityTypeCounts);

        return ResponseEntity.ok(stats);
    }

    private List<Map<String, Object>> getTopEntries(Map<String, Integer> map, int limit) {
        return map.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(e -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("key", e.getKey());
                    entry.put("count", e.getValue());
                    return entry;
                })
                .collect(Collectors.toList());
    }
}
