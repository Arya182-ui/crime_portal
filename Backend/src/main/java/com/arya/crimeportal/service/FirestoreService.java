package com.arya.crimeportal.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService {

    private final Firestore db = FirestoreClient.getFirestore();

    public String createDocument(String collection, Map<String, Object> data) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(collection).document();
        ApiFuture<WriteResult> future = docRef.set(data);
        future.get();
        return docRef.getId();
    }

    public Map<String, Object> getDocument(String collection, String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot snapshot = db.collection(collection).document(id).get().get();
        if (!snapshot.exists()) return null;
        Map<String, Object> map = snapshot.getData();
        map.put("id", snapshot.getId());
        return map;
    }

    public List<QueryDocumentSnapshot> queryCollection(String collection, Query query) throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = query.get().get();
        return snapshot.getDocuments();
    }

    public void updateDocument(String collection, String id, Map<String, Object> updates) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(collection).document(id);
        try {
            docRef.update(updates).get();
        } catch (Exception e) {
            // if update fails (e.g., doc missing), set the document
            docRef.set(updates).get();
        }
    }

    public void setDocument(String collection, String id, Map<String, Object> data) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(collection).document(id);
        docRef.set(data).get();
    }

    public void deleteDocument(String collection, String id) throws ExecutionException, InterruptedException {
        db.collection(collection).document(id).delete().get();
    }
}
