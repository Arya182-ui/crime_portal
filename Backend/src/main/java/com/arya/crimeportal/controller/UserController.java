package com.arya.crimeportal.controller;

import com.arya.crimeportal.model.User;
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
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "50") int limit
    ) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("users").limit(limit);

        if (role != null && !role.isEmpty()) {
            query = query.whereEqualTo("role", role);
        }

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<Map<String, Object>> users = new ArrayList<>();
        for (QueryDocumentSnapshot doc : docs) {
            Map<String, Object> userData = doc.getData();
            userData.put("userId", doc.getId());
            
            // Filter by search if provided
            if (search != null && !search.isEmpty()) {
                String name = (String) userData.get("name");
                String email = (String) userData.get("email");
                if ((name != null && name.toLowerCase().contains(search.toLowerCase())) ||
                    (email != null && email.toLowerCase().contains(search.toLowerCase()))) {
                    users.add(userData);
                }
            } else {
                users.add(userData);
            }
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("users").document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot doc = future.get();

        if (!doc.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        Map<String, Object> userData = doc.getData();
        userData.put("userId", doc.getId());
        return ResponseEntity.ok(userData);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        
        user.setCreatedAt(Instant.now());
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        userData.put("createdAt", user.getCreatedAt().toString());
        userData.put("active", true);

        ApiFuture<DocumentReference> future = db.collection("users").add(userData);
        DocumentReference docRef = future.get();

        Map<String, Object> response = new HashMap<>();
        response.put("userId", docRef.getId());
        response.put("message", "User created successfully");
        response.put("user", userData);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, Object> updates) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("users").document(id);
        
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot doc = future.get();

        if (!doc.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        updates.put("updatedAt", Instant.now().toString());
        ApiFuture<WriteResult> updateFuture = docRef.update(updates);
        updateFuture.get();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User updated successfully");
        response.put("userId", id);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("users").document(id);
        
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot doc = future.get();

        if (!doc.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        ApiFuture<WriteResult> deleteFuture = docRef.delete();
        deleteFuture.get();

        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "userId", id));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("users").get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        Map<String, Integer> roleCounts = new HashMap<>();
        int activeUsers = 0;

        for (QueryDocumentSnapshot doc : docs) {
            String role = doc.getString("role");
            Boolean active = doc.getBoolean("active");
            
            if (role != null) {
                roleCounts.put(role, roleCounts.getOrDefault(role, 0) + 1);
            }
            if (active != null && active) {
                activeUsers++;
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", docs.size());
        stats.put("activeUsers", activeUsers);
        stats.put("roleCounts", roleCounts);

        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> request) 
            throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("users").document(id);
        
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot doc = future.get();

        if (!doc.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        String newRole = request.get("role");
        if (newRole == null || newRole.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Role is required"));
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("role", newRole.toUpperCase());
        updates.put("updatedAt", Instant.now().toString());

        ApiFuture<WriteResult> updateFuture = docRef.update(updates);
        updateFuture.get();

        return ResponseEntity.ok(Map.of(
            "message", "User role updated successfully",
            "userId", id,
            "newRole", newRole.toUpperCase()
        ));
    }
}
