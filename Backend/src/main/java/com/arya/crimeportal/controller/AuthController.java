package com.arya.crimeportal.controller;

import com.arya.crimeportal.service.FirestoreService;
import com.arya.crimeportal.util.SecurityUtil;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.ListUsersPage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final FirestoreService firestoreService;
    private final String COLLECTION = "users";

    public AuthController(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> createOrUpdateProfile(@RequestBody Map<String, Object> body) throws ExecutionException, InterruptedException {
        // require authenticated via Firebase token
        String uid = SecurityUtil.getUid();
        if (uid == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));

        try {
            String name = (String) body.getOrDefault("name", "");
            String email = (String) body.getOrDefault("email", "");
            String photoURL = (String) body.getOrDefault("photoURL", "");
            String role = (String) body.getOrDefault("role", "OFFICER");

            System.out.println("🔵 Creating/Updating profile for UID: " + uid);
            System.out.println("🔵 Email: " + email + ", Name: " + name);

            // Check if profile already exists
            Map<String, Object> existingProfile = firestoreService.getDocument(COLLECTION, uid);
            boolean isNewProfile = (existingProfile == null);
            
            if (isNewProfile) {
                System.out.println("✅ New profile - creating...");
            } else {
                System.out.println("⚠️  Profile already exists - updating...");
            }

            // Update Firebase Authentication user profile
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid);
            
            if (name != null && !name.isBlank()) {
                request.setDisplayName(name);
            }
            
            if (photoURL != null && !photoURL.isBlank()) {
                request.setPhotoUrl(photoURL);
            }
            
            // Update Firebase Auth user
            UserRecord userRecord = FirebaseAuth.getInstance().updateUser(request);

            // Also save to Firestore for additional data
            Map<String, Object> data = new HashMap<>();
            data.put("userId", uid);
            data.put("name", name);
            data.put("email", email);
            data.put("photoURL", photoURL);
            data.put("role", role);
            
            if (isNewProfile) {
                data.put("status", "PENDING"); // New users are PENDING by default
                data.put("createdAt", Instant.now().toString());
            }
            data.put("updatedAt", Instant.now().toString());

            // Use uid as document id to keep it idempotent (prevents duplicates)
            firestoreService.setDocument(COLLECTION, uid, data);
            
            System.out.println("✅ Profile saved successfully for UID: " + uid);
            
            return ResponseEntity.ok(Map.of(
                "message", isNewProfile ? "Profile created successfully" : "Profile updated successfully",
                "userId", uid,
                "displayName", userRecord.getDisplayName() != null ? userRecord.getDisplayName() : "",
                "photoURL", userRecord.getPhotoUrl() != null ? userRecord.getPhotoUrl() : "",
                "isNewProfile", isNewProfile
            ));
        } catch (Exception e) {
            System.err.println("❌ Error in createOrUpdateProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        String uid = SecurityUtil.getUid();
        if (uid == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        return ResponseEntity.ok(Map.of("uid", uid, "role", SecurityUtil.getRole()));
    }

    // Set Firebase custom claims for role (for development/testing - in production, restrict this!)
    @PostMapping("/set-role")
    public ResponseEntity<?> setRole(@RequestBody Map<String, Object> body) {
        try {
            String uid = (String) body.get("uid");
            String role = (String) body.getOrDefault("role", "OFFICER");
            
            if (uid == null || uid.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "uid is required"));
            }
            
            // Set custom claims
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role);
            FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);
            
            return ResponseEntity.ok(Map.of("message", "Role set successfully. Please log out and log in again.", "uid", uid, "role", role));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Set role for current user (convenience endpoint for development)
    @PostMapping("/set-my-role")
    public ResponseEntity<?> setMyRole(@RequestBody Map<String, Object> body) {
        try {
            String uid = SecurityUtil.getUid();
            if (uid == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
            
            String role = (String) body.getOrDefault("role", "ADMIN");
            
            // Set custom claims
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role);
            FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);
            
            return ResponseEntity.ok(Map.of("message", "Role set successfully. Please log out and log in again to refresh your token.", "uid", uid, "role", role));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // List all users (Admin only)
    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        try {
            String currentRole = SecurityUtil.getRole();
            if (!"ADMIN".equals(currentRole)) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }

            List<Map<String, Object>> usersList = new ArrayList<>();
            ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);
            
            while (page != null) {
                for (UserRecord user : page.getValues()) {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("uid", user.getUid());
                    userMap.put("email", user.getEmail());
                    userMap.put("displayName", user.getDisplayName());
                    userMap.put("photoURL", user.getPhotoUrl());
                    userMap.put("emailVerified", user.isEmailVerified());
                    userMap.put("disabled", user.isDisabled());
                    userMap.put("creationTimestamp", user.getUserMetadata().getCreationTimestamp());
                    userMap.put("lastSignInTimestamp", user.getUserMetadata().getLastSignInTimestamp());
                    
                    // Get custom claims (role)
                    Map<String, Object> claims = user.getCustomClaims();
                    userMap.put("role", claims != null ? claims.get("role") : null);
                    
                    // Get status from Firestore
                    try {
                        Map<String, Object> firestoreData = firestoreService.getDocument(COLLECTION, user.getUid());
                        if (firestoreData != null) {
                            userMap.put("status", firestoreData.getOrDefault("status", "PENDING"));
                            userMap.put("approvedAt", firestoreData.get("approvedAt"));
                            userMap.put("approvedBy", firestoreData.get("approvedBy"));
                        } else {
                            userMap.put("status", "PENDING");
                        }
                    } catch (Exception e) {
                        userMap.put("status", "PENDING");
                    }
                    
                    usersList.add(userMap);
                }
                page = page.getNextPage();
            }
            
            return ResponseEntity.ok(Map.of("users", usersList, "count", usersList.size()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Get single user details (Admin only)
    @GetMapping("/users/{uid}")
    public ResponseEntity<?> getUser(@PathVariable String uid) {
        try {
            String currentRole = SecurityUtil.getRole();
            if (!"ADMIN".equals(currentRole)) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }

            UserRecord user = FirebaseAuth.getInstance().getUser(uid);
            
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("uid", user.getUid());
            userMap.put("email", user.getEmail());
            userMap.put("displayName", user.getDisplayName());
            userMap.put("photoURL", user.getPhotoUrl());
            userMap.put("emailVerified", user.isEmailVerified());
            userMap.put("disabled", user.isDisabled());
            userMap.put("creationTimestamp", user.getUserMetadata().getCreationTimestamp());
            userMap.put("lastSignInTimestamp", user.getUserMetadata().getLastSignInTimestamp());
            
            Map<String, Object> claims = user.getCustomClaims();
            userMap.put("role", claims != null ? claims.get("role") : null);
            
            return ResponseEntity.ok(userMap);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Create new user (Admin only)
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> body) {
        try {
            String currentRole = SecurityUtil.getRole();
            if (!"ADMIN".equals(currentRole)) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }

            String email = (String) body.get("email");
            String password = (String) body.get("password");
            String displayName = (String) body.get("displayName");
            String photoURL = (String) body.get("photoURL");
            String role = (String) body.getOrDefault("role", "OFFICER");
            
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
            }

            // Create user in Firebase Auth
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setEmailVerified(false)
                .setDisabled(false);
            
            if (displayName != null && !displayName.isBlank()) {
                request.setDisplayName(displayName);
            }
            
            if (photoURL != null && !photoURL.isBlank()) {
                request.setPhotoUrl(photoURL);
            }
            
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            
            // Set role as custom claim
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role);
            FirebaseAuth.getInstance().setCustomUserClaims(userRecord.getUid(), claims);
            
            // Save to Firestore
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", userRecord.getUid());
            userData.put("email", email);
            userData.put("name", displayName);
            userData.put("photoURL", photoURL);
            userData.put("role", role);
            userData.put("createdAt", Instant.now().toString());
            
            firestoreService.updateDocument(COLLECTION, userRecord.getUid(), userData);
            
            return ResponseEntity.ok(Map.of(
                "message", "User created successfully",
                "uid", userRecord.getUid(),
                "email", userRecord.getEmail(),
                "displayName", userRecord.getDisplayName(),
                "role", role
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Update user (Admin only)
    @PutMapping("/users/{uid}")
    public ResponseEntity<?> updateUser(@PathVariable String uid, @RequestBody Map<String, Object> body) {
        try {
            String currentRole = SecurityUtil.getRole();
            if (!"ADMIN".equals(currentRole)) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }

            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid);
            
            String displayName = (String) body.get("displayName");
            String photoURL = (String) body.get("photoURL");
            String role = (String) body.get("role");
            Boolean disabled = (Boolean) body.get("disabled");
            
            if (displayName != null) {
                request.setDisplayName(displayName);
            }
            
            if (photoURL != null) {
                request.setPhotoUrl(photoURL);
            }
            
            if (disabled != null) {
                request.setDisabled(disabled);
            }
            
            UserRecord userRecord = FirebaseAuth.getInstance().updateUser(request);
            
            // Update role if provided
            if (role != null) {
                Map<String, Object> claims = new HashMap<>();
                claims.put("role", role);
                FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);
            }
            
            // Update Firestore
            Map<String, Object> userData = new HashMap<>();
            userData.put("name", displayName);
            userData.put("photoURL", photoURL);
            userData.put("role", role);
            userData.put("updatedAt", Instant.now().toString());
            
            firestoreService.updateDocument(COLLECTION, uid, userData);
            
            return ResponseEntity.ok(Map.of(
                "message", "User updated successfully",
                "uid", uid
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Delete user (Admin only)
    @DeleteMapping("/users/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable String uid) {
        try {
            String currentRole = SecurityUtil.getRole();
            if (!"ADMIN".equals(currentRole)) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }

            // Don't allow admin to delete themselves
            String currentUid = SecurityUtil.getUid();
            if (uid.equals(currentUid)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cannot delete your own account"));
            }

            // Delete from Firebase Auth
            FirebaseAuth.getInstance().deleteUser(uid);
            
            // Delete from Firestore
            firestoreService.deleteDocument(COLLECTION, uid);
            
            return ResponseEntity.ok(Map.of("message", "User deleted successfully", "uid", uid));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Approve user (Admin only)
    @PostMapping("/users/{uid}/approve")
    public ResponseEntity<?> approveUser(@PathVariable String uid) {
        try {
            String currentRole = SecurityUtil.getRole();
            if (!"ADMIN".equals(currentRole)) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }

            String currentUid = SecurityUtil.getUid();
            
            // Update user status in Firestore
            Map<String, Object> updates = new HashMap<>();
            updates.put("status", "APPROVED");
            updates.put("approvedAt", Instant.now().toString());
            updates.put("approvedBy", currentUid);
            updates.put("updatedAt", Instant.now().toString());
            
            firestoreService.updateDocument(COLLECTION, uid, updates);
            
            System.out.println("✅ User approved: " + uid + " by " + currentUid);
            
            return ResponseEntity.ok(Map.of(
                "message", "User approved successfully",
                "uid", uid,
                "status", "APPROVED"
            ));
        } catch (Exception e) {
            System.err.println("❌ Error approving user: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Reject user (Admin only)
    @PostMapping("/users/{uid}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable String uid) {
        try {
            String currentRole = SecurityUtil.getRole();
            if (!"ADMIN".equals(currentRole)) {
                return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
            }

            String currentUid = SecurityUtil.getUid();
            
            // Update user status in Firestore
            Map<String, Object> updates = new HashMap<>();
            updates.put("status", "REJECTED");
            updates.put("rejectedAt", Instant.now().toString());
            updates.put("rejectedBy", currentUid);
            updates.put("updatedAt", Instant.now().toString());
            
            firestoreService.updateDocument(COLLECTION, uid, updates);
            
            System.out.println("⚠️ User rejected: " + uid + " by " + currentUid);
            
            return ResponseEntity.ok(Map.of(
                "message", "User rejected successfully",
                "uid", uid,
                "status", "REJECTED"
            ));
        } catch (Exception e) {
            System.err.println("❌ Error rejecting user: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Get user profile with status check
    @GetMapping("/profile/status")
    public ResponseEntity<?> getProfileStatus() throws ExecutionException, InterruptedException {
        String uid = SecurityUtil.getUid();
        if (uid == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));

        Map<String, Object> profile = firestoreService.getDocument(COLLECTION, uid);
        
        if (profile == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Profile not found"));
        }

        // If status field doesn't exist (legacy accounts), default to APPROVED
        String status = (String) profile.getOrDefault("status", "APPROVED");
        
        System.out.println("✅ Profile status for " + uid + ": " + status);
        
        return ResponseEntity.ok(Map.of(
            "userId", uid,
            "status", status,
            "profile", profile
        ));
    }
}
