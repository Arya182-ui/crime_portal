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
@RequestMapping("/api/criminals")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Validated
public class CriminalController {

    private final FirestoreService firestoreService;
    private final String COLLECTION = "criminals";

    public CriminalController(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    record CreateCriminalRequest(
        @NotBlank String name, 
        Integer age,
        String gender,
        String alias,
        String status,
        String dangerLevel,
        String address,
        String identificationMarks,
        String lastSeenLocation,
        String photoUrl
    ) {}

    @PostMapping
    public ResponseEntity<?> createCriminal(@Valid @RequestBody CreateCriminalRequest req) throws ExecutionException, InterruptedException {
        String role = SecurityUtil.getRole();
        if (role == null || (!role.equalsIgnoreCase("OFFICER") && !role.equalsIgnoreCase("ADMIN"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Insufficient role to create criminals"));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("name", req.name());
        data.put("age", req.age() != null ? req.age() : 0);
        data.put("gender", req.gender() != null ? req.gender() : "Unknown");
        data.put("alias", req.alias() != null ? req.alias() : "");
        data.put("status", req.status() != null ? req.status() : "AT_LARGE");
        data.put("dangerLevel", req.dangerLevel() != null ? req.dangerLevel() : "MEDIUM");
        data.put("address", req.address() != null ? req.address() : "");
        data.put("identificationMarks", req.identificationMarks() != null ? req.identificationMarks() : "");
        data.put("lastSeenLocation", req.lastSeenLocation() != null ? req.lastSeenLocation() : "");
        data.put("photoUrl", req.photoUrl() != null ? req.photoUrl() : "");
        data.put("createdAt", Instant.now().toString());
        data.put("updatedAt", Instant.now().toString());
        data.put("createdBy", SecurityUtil.getUid());

        String id = firestoreService.createDocument(COLLECTION, data);
        return ResponseEntity.ok(Map.of("criminalId", id, "message", "Criminal record created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCriminal(@PathVariable String id) throws ExecutionException, InterruptedException {
        Map<String, Object> doc = firestoreService.getDocument(COLLECTION, id);
        if (doc == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(doc);
    }

    @GetMapping
    public ResponseEntity<?> listCriminals(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dangerLevel,
            @RequestParam(defaultValue = "200") int limit
    ) throws ExecutionException, InterruptedException {
        com.google.cloud.firestore.Firestore db = com.google.firebase.cloud.FirestoreClient.getFirestore();
        com.google.cloud.firestore.Query query;
        
        if (status != null && !status.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("status", status).limit(limit);
        } else if (dangerLevel != null && !dangerLevel.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("dangerLevel", dangerLevel).limit(limit);
        } else if (name != null && !name.isBlank()) {
            String end = name + "\uf8ff";
            query = db.collection(COLLECTION).orderBy("name").startAt(name).endAt(end).limit(limit);
        } else {
            query = db.collection(COLLECTION).orderBy("createdAt", com.google.cloud.firestore.Query.Direction.DESCENDING).limit(limit);
        }

        com.google.api.core.ApiFuture<com.google.cloud.firestore.QuerySnapshot> future = query.get();
        java.util.List<com.google.cloud.firestore.QueryDocumentSnapshot> docs = future.get().getDocuments();
        java.util.List<java.util.Map<String,Object>> items = new java.util.ArrayList<>();
        for (com.google.cloud.firestore.QueryDocumentSnapshot d : docs) {
            java.util.Map<String,Object> m = d.getData();
            m.put("id", d.getId());
            m.put("criminalId", d.getId());
            items.add(m);
        }
        return ResponseEntity.ok(java.util.Map.of("count", items.size(), "items", items));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCriminal(@PathVariable String id, @RequestBody Map<String, Object> updates) throws ExecutionException, InterruptedException {
        String role = SecurityUtil.getRole();
        if (role == null || (!role.equalsIgnoreCase("OFFICER") && !role.equalsIgnoreCase("ADMIN"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Insufficient role to update criminals"));
        }
        
        Map<String, Object> allowed = new HashMap<>();
        if (updates.containsKey("name")) allowed.put("name", updates.get("name"));
        if (updates.containsKey("age")) allowed.put("age", updates.get("age"));
        if (updates.containsKey("gender")) allowed.put("gender", updates.get("gender"));
        if (updates.containsKey("alias")) allowed.put("alias", updates.get("alias"));
        if (updates.containsKey("status")) allowed.put("status", updates.get("status"));
        if (updates.containsKey("dangerLevel")) allowed.put("dangerLevel", updates.get("dangerLevel"));
        if (updates.containsKey("address")) allowed.put("address", updates.get("address"));
        if (updates.containsKey("identificationMarks")) allowed.put("identificationMarks", updates.get("identificationMarks"));
        if (updates.containsKey("lastSeenLocation")) allowed.put("lastSeenLocation", updates.get("lastSeenLocation"));
        if (updates.containsKey("lastSeenDate")) allowed.put("lastSeenDate", updates.get("lastSeenDate"));
        if (updates.containsKey("photoUrl")) allowed.put("photoUrl", updates.get("photoUrl"));
        
        if (allowed.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "No updatable fields provided"));

        allowed.put("updatedAt", Instant.now().toString());
        firestoreService.updateDocument(COLLECTION, id, allowed);
        return ResponseEntity.ok(Map.of("updated", true, "message", "Criminal record updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCriminal(@PathVariable String id) throws ExecutionException, InterruptedException {
        String role = SecurityUtil.getRole();
        if (role == null || !role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Only ADMIN can delete criminals"));
        }
        firestoreService.deleteDocument(COLLECTION, id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}

