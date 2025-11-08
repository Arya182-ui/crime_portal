package com.arya.crimeportal.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StatsController {

    @GetMapping
    public ResponseEntity<?> getStats() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Basic counts (note: for production consider aggregation queries or Cloud Functions for heavy datasets)
        ApiFuture<QuerySnapshot> crimesFuture = db.collection("crimes").get();
        ApiFuture<QuerySnapshot> firsFuture = db.collection("firs").get();
        ApiFuture<QuerySnapshot> criminalsFuture = db.collection("criminals").get();
        ApiFuture<QuerySnapshot> usersFuture = db.collection("users").get();

        List<QueryDocumentSnapshot> crimesDocs = crimesFuture.get().getDocuments();
        List<QueryDocumentSnapshot> firsDocs = firsFuture.get().getDocuments();
        List<QueryDocumentSnapshot> criminalsDocs = criminalsFuture.get().getDocuments();
        List<QueryDocumentSnapshot> usersDocs = usersFuture.get().getDocuments();

        int totalCrimes = crimesDocs.size();
        int openFirs = firsDocs.size();
        int knownCriminals = criminalsDocs.size();
        int users = usersDocs.size();

        // Build simple crimesPerDay for the last 7 days from crime.date (assumes ISO-8601 string stored)
        Map<String, Integer> perDay = new HashMap<>();
        Instant now = Instant.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd").withLocale(Locale.US).withZone(ZoneId.systemDefault());
        for (int i = 6; i >= 0; i--) {
            Instant day = now.minusSeconds(86400L * i);
            perDay.put(fmt.format(day), 0);
        }

        for (QueryDocumentSnapshot d : crimesDocs) {
            Object dateObj = d.get("date");
            if (dateObj != null) {
                try {
                    Instant t = Instant.parse(dateObj.toString());
                    String key = fmt.format(t);
                    if (perDay.containsKey(key)) perDay.put(key, perDay.get(key) + 1);
                } catch (Exception ignored) { }
            }
        }

        // Compose response
        Map<String, Object> resp = new HashMap<>();
        resp.put("totalCrimes", totalCrimes);
        resp.put("openFirs", openFirs);
        resp.put("knownCriminals", knownCriminals);
        resp.put("users", users);
        resp.put("crimesPerDay", perDay);

        return ResponseEntity.ok(resp);
    }
}
