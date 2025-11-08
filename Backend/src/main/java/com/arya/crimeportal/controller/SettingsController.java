package com.arya.crimeportal.controller;

import com.arya.crimeportal.model.SystemSettings;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SettingsController {

    @GetMapping
    public ResponseEntity<?> getAllSettings(@RequestParam(required = false) String category) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("settings");

        if (category != null && !category.isEmpty()) {
            query = query.whereEqualTo("category", category);
        }

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<Map<String, Object>> settings = new ArrayList<>();
        for (QueryDocumentSnapshot doc : docs) {
            Map<String, Object> setting = doc.getData();
            setting.put("settingId", doc.getId());
            settings.add(setting);
        }

        return ResponseEntity.ok(settings);
    }

    @GetMapping("/{key}")
    public ResponseEntity<?> getSettingByKey(@PathVariable String key) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("settings").whereEqualTo("key", key);
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        if (docs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Setting not found"));
        }

        DocumentSnapshot doc = docs.get(0);
        Map<String, Object> setting = doc.getData();
        setting.put("settingId", doc.getId());
        return ResponseEntity.ok(setting);
    }

    @PostMapping
    public ResponseEntity<?> createSetting(@RequestBody SystemSettings setting) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        
        setting.setUpdatedAt(Instant.now());

        Map<String, Object> settingData = new HashMap<>();
        settingData.put("key", setting.getKey());
        settingData.put("value", setting.getValue());
        settingData.put("description", setting.getDescription());
        settingData.put("category", setting.getCategory());
        settingData.put("updatedAt", setting.getUpdatedAt().toString());
        settingData.put("updatedBy", setting.getUpdatedBy());

        ApiFuture<DocumentReference> future = db.collection("settings").add(settingData);
        DocumentReference docRef = future.get();

        Map<String, Object> response = new HashMap<>();
        response.put("settingId", docRef.getId());
        response.put("message", "Setting created successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{key}")
    public ResponseEntity<?> updateSetting(@PathVariable String key, @RequestBody Map<String, Object> updates) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("settings").whereEqualTo("key", key);
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        if (docs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Setting not found"));
        }

        DocumentSnapshot doc = docs.get(0);
        updates.put("updatedAt", Instant.now().toString());
        ApiFuture<WriteResult> updateFuture = db.collection("settings").document(doc.getId()).update(updates);
        updateFuture.get();

        return ResponseEntity.ok(Map.of("message", "Setting updated successfully", "key", key));
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<?> deleteSetting(@PathVariable String key) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("settings").whereEqualTo("key", key);
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        if (docs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Setting not found"));
        }

        DocumentSnapshot doc = docs.get(0);
        ApiFuture<WriteResult> deleteFuture = db.collection("settings").document(doc.getId()).delete();
        deleteFuture.get();

        return ResponseEntity.ok(Map.of("message", "Setting deleted successfully", "key", key));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("settings").get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        Set<String> categories = new HashSet<>();
        for (QueryDocumentSnapshot doc : docs) {
            String category = doc.getString("category");
            if (category != null) {
                categories.add(category);
            }
        }

        return ResponseEntity.ok(Map.of("categories", categories));
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> bulkUpdateSettings(@RequestBody List<Map<String, Object>> settingsList) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        WriteBatch batch = db.batch();
        int updated = 0;

        for (Map<String, Object> settingUpdate : settingsList) {
            String key = (String) settingUpdate.get("key");
            if (key == null) continue;

            Query query = db.collection("settings").whereEqualTo("key", key);
            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();

            if (!docs.isEmpty()) {
                DocumentSnapshot doc = docs.get(0);
                settingUpdate.put("updatedAt", Instant.now().toString());
                batch.update(db.collection("settings").document(doc.getId()), settingUpdate);
                updated++;
            }
        }

        ApiFuture<List<WriteResult>> batchFuture = batch.commit();
        batchFuture.get();

        return ResponseEntity.ok(Map.of(
            "message", "Bulk update completed",
            "updatedCount", updated
        ));
    }
}
