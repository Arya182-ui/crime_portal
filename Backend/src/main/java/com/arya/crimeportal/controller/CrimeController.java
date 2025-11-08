package com.arya.crimeportal.controller;

import com.arya.crimeportal.service.FirestoreService;
import com.arya.crimeportal.util.SecurityUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/crimes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Validated
public class CrimeController {

    private final FirestoreService firestoreService;
    private final String COLLECTION = "crimes";

    public CrimeController(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    record CreateCrimeRequest(
        @NotBlank String title, 
        @NotBlank String location, 
        String description, 
        String date,
        String category,
        String severity,
        String status
    ) {}

    @PostMapping
    public ResponseEntity<?> createCrime(@Valid @RequestBody CreateCrimeRequest req) throws ExecutionException, InterruptedException {
        String role = SecurityUtil.getRole();
        if (role == null || (!role.equalsIgnoreCase("OFFICER") && !role.equalsIgnoreCase("ADMIN") && !role.equalsIgnoreCase("USER"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Authentication required"));
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("title", req.title());
        data.put("location", req.location());
        data.put("description", req.description() != null ? req.description() : "");
        data.put("date", req.date() == null ? Instant.now().toString() : req.date());
        data.put("category", req.category() != null ? req.category() : "OTHER");
        data.put("severity", req.severity() != null ? req.severity() : "MEDIUM");
        data.put("status", req.status() != null ? req.status() : "REPORTED");
        data.put("officerId", SecurityUtil.getUid());
        data.put("reportedBy", SecurityUtil.getUid());
        data.put("reportedByName", SecurityUtil.getName() != null ? SecurityUtil.getName() : "Unknown");
        data.put("createdAt", Instant.now().toString());
        data.put("updatedAt", Instant.now().toString());

        String id = firestoreService.createDocument(COLLECTION, data);
        return ResponseEntity.ok(Map.of("crimeId", id, "message", "Crime reported successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCrime(@PathVariable String id) throws ExecutionException, InterruptedException {
        Map<String, Object> doc = firestoreService.getDocument(COLLECTION, id);
        if (doc == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(doc);
    }

    @GetMapping
    public ResponseEntity<?> listCrimes(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "200") int limit
    ) throws ExecutionException, InterruptedException {
        com.google.cloud.firestore.Firestore db = com.google.firebase.cloud.FirestoreClient.getFirestore();
        com.google.cloud.firestore.Query query = db.collection(COLLECTION)
                .orderBy("createdAt", com.google.cloud.firestore.Query.Direction.DESCENDING)
                .limit(limit);

        // Apply filters
        if (status != null && !status.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("status", status).limit(limit);
        }
        if (category != null && !category.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("category", category).limit(limit);
        }
        if (severity != null && !severity.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("severity", severity).limit(limit);
        }
        if (location != null && !location.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("location", location).limit(limit);
        }
        if (title != null && !title.isBlank()) {
            String end = title + "\uf8ff";
            query = db.collection(COLLECTION).orderBy("title").startAt(title).endAt(end).limit(limit);
        }

        com.google.api.core.ApiFuture<com.google.cloud.firestore.QuerySnapshot> future = query.get();
        java.util.List<com.google.cloud.firestore.QueryDocumentSnapshot> docs = future.get().getDocuments();
        java.util.List<java.util.Map<String,Object>> items = new java.util.ArrayList<>();
        for (com.google.cloud.firestore.QueryDocumentSnapshot d : docs) {
            java.util.Map<String,Object> m = d.getData();
            m.put("id", d.getId());
            m.put("crimeId", d.getId());
            items.add(m);
        }
        return ResponseEntity.ok(java.util.Map.of("count", items.size(), "items", items));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrime(@PathVariable String id, @RequestBody Map<String, Object> updates) throws ExecutionException, InterruptedException {
        String role = SecurityUtil.getRole();
        if (role == null || (!role.equalsIgnoreCase("OFFICER") && !role.equalsIgnoreCase("ADMIN"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Insufficient role to update crimes"));
        }
        
        // Allow update of more fields
        Map<String, Object> allowed = new HashMap<>();
        if (updates.containsKey("title")) allowed.put("title", updates.get("title"));
        if (updates.containsKey("description")) allowed.put("description", updates.get("description"));
        if (updates.containsKey("location")) allowed.put("location", updates.get("location"));
        if (updates.containsKey("status")) allowed.put("status", updates.get("status"));
        if (updates.containsKey("category")) allowed.put("category", updates.get("category"));
        if (updates.containsKey("severity")) allowed.put("severity", updates.get("severity"));
        if (updates.containsKey("officerId")) allowed.put("officerId", updates.get("officerId"));
        
        if (allowed.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "No updatable fields provided"));

        allowed.put("updatedAt", Instant.now().toString());
        firestoreService.updateDocument(COLLECTION, id, allowed);
        return ResponseEntity.ok(Map.of("updated", true, "message", "Crime updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCrime(@PathVariable String id) throws ExecutionException, InterruptedException {
        String role = SecurityUtil.getRole();
        if (role == null || !role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Only ADMIN can delete crimes"));
        }
        firestoreService.deleteDocument(COLLECTION, id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
