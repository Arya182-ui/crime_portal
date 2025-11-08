package com.arya.crimeportal.controller;

import com.arya.crimeportal.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/firs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Validated
public class FirController {

    private final FirestoreService firestoreService;
    private final String COLLECTION = "firs";

    public FirController(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    record CreateFirRequest(
        @NotBlank String complainantName, 
        @NotBlank String contact, 
        @NotBlank String details,
        String crimeId,
        String incidentLocation,
        String incidentDate,
        String status
    ) {}

    @PostMapping
    public ResponseEntity<?> createFir(@Valid @RequestBody CreateFirRequest req) throws ExecutionException, InterruptedException {
        // Generate FIR number
        String firNumber = "FIR" + System.currentTimeMillis();
        
        Map<String, Object> data = new HashMap<>();
        data.put("firNumber", firNumber);
        data.put("complainantName", req.complainantName());
        data.put("contact", req.contact());
        data.put("details", req.details());
        data.put("crimeId", req.crimeId());
        data.put("incidentLocation", req.incidentLocation() != null ? req.incidentLocation() : "");
        data.put("incidentDate", req.incidentDate() != null ? req.incidentDate() : Instant.now().toString());
        data.put("status", req.status() != null ? req.status() : "PENDING");
        data.put("createdAt", Instant.now().toString());
        data.put("updatedAt", Instant.now().toString());

        String id = firestoreService.createDocument(COLLECTION, data);
        return ResponseEntity.ok(Map.of(
            "firId", id, 
            "firNumber", firNumber,
            "message", "FIR filed successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFir(@PathVariable String id) throws ExecutionException, InterruptedException {
        Map<String, Object> doc = firestoreService.getDocument(COLLECTION, id);
        if (doc == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(doc);
    }

    @GetMapping
    public ResponseEntity<?> listFirs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String complainantName,
            @RequestParam(defaultValue = "100") int limit
    ) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION)
                .orderBy("createdAt", Query.Direction.DESCENDING)
                .limit(limit);

        if (status != null && !status.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("status", status).limit(limit);
        }
        if (complainantName != null && !complainantName.isBlank()) {
            String end = complainantName + "\uf8ff";
            query = db.collection(COLLECTION).orderBy("complainantName").startAt(complainantName).endAt(end).limit(limit);
        }

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        List<Map<String, Object>> items = new ArrayList<>();
        for (QueryDocumentSnapshot d : docs) {
            Map<String, Object> m = d.getData();
            m.put("id", d.getId());
            m.put("firId", d.getId());
            items.add(m);
        }
        return ResponseEntity.ok(Map.of("count", items.size(), "items", items));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchFirs(
            @RequestParam(required = false) String complainantName, 
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String firNumber
    ) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        Query query = db.collection(COLLECTION).orderBy("createdAt", Query.Direction.DESCENDING);
        
        if (firNumber != null && !firNumber.isBlank()) {
            query = db.collection(COLLECTION).whereEqualTo("firNumber", firNumber);
        } else if (complainantName != null && !complainantName.isBlank()) {
            String end = complainantName + "\uf8ff";
            query = db.collection(COLLECTION).orderBy("complainantName").startAt(complainantName).endAt(end);
        }

        ApiFuture<QuerySnapshot> future = query.limit(100).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        List<Map<String, Object>> results = new ArrayList<>();
        for (QueryDocumentSnapshot d : docs) {
            Map<String, Object> m = d.getData();
            m.put("id", d.getId());
            m.put("firId", d.getId());
            results.add(m);
        }
        return ResponseEntity.ok(Map.of("count", results.size(), "items", results));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFir(@PathVariable String id, @RequestBody Map<String, Object> updates) 
            throws ExecutionException, InterruptedException {
        Map<String, Object> allowed = new HashMap<>();
        if (updates.containsKey("status")) allowed.put("status", updates.get("status"));
        if (updates.containsKey("officerId")) allowed.put("officerId", updates.get("officerId"));
        if (updates.containsKey("officerName")) allowed.put("officerName", updates.get("officerName"));
        if (updates.containsKey("details")) allowed.put("details", updates.get("details"));
        
        if (allowed.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No updatable fields provided"));
        }

        allowed.put("updatedAt", Instant.now().toString());
        firestoreService.updateDocument(COLLECTION, id, allowed);
        return ResponseEntity.ok(Map.of("updated", true, "message", "FIR updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFir(@PathVariable String id) throws ExecutionException, InterruptedException {
        firestoreService.deleteDocument(COLLECTION, id);
        return ResponseEntity.ok(Map.of("deleted", true, "message", "FIR deleted successfully"));
    }
}
