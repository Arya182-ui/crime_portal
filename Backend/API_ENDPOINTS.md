# Crime Portal - Backend API Documentation

## 🎯 Base URL
```
http://localhost:8080/api
```

## 🔐 Authentication
All endpoints require Firebase JWT token in Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## 📋 API Endpoints

### 🏠 Dashboard & Statistics

#### Get Dashboard Stats
```http
GET /stats
```
**Response:**
```json
{
  "totalCrimes": 150,
  "openFirs": 45,
  "knownCriminals": 30,
  "users": 12,
  "crimesPerDay": {
    "2025-11-01": 5,
    "2025-11-02": 3,
    "2025-11-03": 8
  }
}
```

#### Get Dashboard Summary
```http
GET /dashboard/stats
```
**Response:** Comprehensive dashboard data including deltas, trends, breakdowns

#### Get Recent Activity
```http
GET /dashboard/recent-activity
```

#### Get Monthly Charts
```http
GET /dashboard/charts/monthly
```

#### Get Top Locations
```http
GET /dashboard/top-locations
```

---

### 🔨 Crime Management

#### List Crimes (with filters)
```http
GET /crimes?status={status}&category={category}&severity={severity}&location={location}&title={title}&limit={limit}
```
**Query Parameters:**
- `status`: REPORTED, INVESTIGATING, SOLVED, CLOSED, COLD_CASE
- `category`: THEFT, ROBBERY, ASSAULT, MURDER, FRAUD, CYBERCRIME, etc.
- `severity`: LOW, MEDIUM, HIGH, CRITICAL
- `location`: Location filter (partial match)
- `title`: Title search (partial match)
- `limit`: Max results (default: 100)

**Response:**
```json
{
  "count": 10,
  "items": [
    {
      "id": "abc123",
      "crimeId": "abc123",
      "title": "Theft at Market",
      "location": "Downtown",
      "description": "Stolen items...",
      "status": "INVESTIGATING",
      "category": "THEFT",
      "severity": "MEDIUM",
      "date": "2025-11-08T10:00:00Z",
      "reportedBy": "user123",
      "reportedByName": "John Doe",
      "createdAt": "2025-11-08T10:00:00Z",
      "updatedAt": "2025-11-08T12:00:00Z"
    }
  ]
}
```

#### Get Crime by ID
```http
GET /crimes/{id}
```

#### Create Crime
```http
POST /crimes
Content-Type: application/json

{
  "title": "Theft at Market",
  "location": "Downtown",
  "description": "Stolen items...",
  "category": "THEFT",
  "severity": "MEDIUM",
  "status": "REPORTED",
  "date": "2025-11-08T10:00:00Z"
}
```
**Required Role:** USER, OFFICER, or ADMIN

#### Update Crime
```http
PUT /crimes/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "location": "New Location",
  "description": "Updated description",
  "status": "INVESTIGATING",
  "category": "ROBBERY",
  "severity": "HIGH",
  "officerId": "officer123"
}
```
**Required Role:** OFFICER or ADMIN

#### Delete Crime
```http
DELETE /crimes/{id}
```
**Required Role:** ADMIN only

---

### 📄 FIR Management

#### List FIRs (with filters)
```http
GET /firs?status={status}&complainantName={name}&limit={limit}
```
**Query Parameters:**
- `status`: PENDING, REGISTERED, INVESTIGATING, EVIDENCE_COLLECTED, CHARGE_SHEET_FILED, CLOSED
- `complainantName`: Search by complainant name
- `limit`: Max results (default: 100)

**Response:**
```json
{
  "count": 5,
  "items": [
    {
      "id": "fir123",
      "firId": "fir123",
      "firNumber": "FIR1730000000",
      "complainantName": "Jane Doe",
      "contact": "+1234567890",
      "details": "Incident details...",
      "status": "REGISTERED",
      "incidentLocation": "Main Street",
      "incidentDate": "2025-11-07T14:00:00Z",
      "officerId": "officer123",
      "officerName": "Officer Smith",
      "crimeId": "crime123",
      "createdAt": "2025-11-08T09:00:00Z",
      "updatedAt": "2025-11-08T11:00:00Z"
    }
  ]
}
```

#### Get FIR by ID
```http
GET /firs/{id}
```

#### Search FIRs
```http
GET /firs/search?complainantName={name}&firNumber={number}
```

#### Create FIR
```http
POST /firs
Content-Type: application/json

{
  "complainantName": "Jane Doe",
  "contact": "+1234567890",
  "details": "Incident details...",
  "incidentLocation": "Main Street",
  "incidentDate": "2025-11-07T14:00:00Z",
  "crimeId": "crime123",
  "status": "PENDING"
}
```
**Note:** `firNumber` is auto-generated (format: FIR{timestamp})

#### Update FIR
```http
PUT /firs/{id}
Content-Type: application/json

{
  "status": "INVESTIGATING",
  "officerId": "officer123",
  "officerName": "Officer Smith",
  "details": "Updated details..."
}
```
**Required Role:** OFFICER or ADMIN

#### Delete FIR
```http
DELETE /firs/{id}
```
**Required Role:** ADMIN only

---

### 👤 Criminal Management

#### List Criminals (with filters)
```http
GET /criminals?name={name}&status={status}&dangerLevel={level}&limit={limit}
```
**Query Parameters:**
- `name`: Search by name (prefix match)
- `status`: AT_LARGE, ARRESTED, IN_CUSTODY, CONVICTED, RELEASED, WANTED
- `dangerLevel`: LOW, MEDIUM, HIGH, CRITICAL
- `limit`: Max results (default: 200)

**Response:**
```json
{
  "count": 3,
  "items": [
    {
      "id": "criminal123",
      "criminalId": "criminal123",
      "name": "John Criminal",
      "age": 35,
      "gender": "Male",
      "alias": "Johnny C",
      "status": "AT_LARGE",
      "dangerLevel": "HIGH",
      "address": "Unknown",
      "identificationMarks": "Scar on left arm",
      "lastSeenLocation": "Downtown",
      "lastSeenDate": "2025-11-01T18:00:00Z",
      "photoUrl": "https://example.com/photo.jpg",
      "createdAt": "2025-11-08T10:00:00Z",
      "updatedAt": "2025-11-08T10:00:00Z"
    }
  ]
}
```

#### Get Criminal by ID
```http
GET /criminals/{id}
```

#### Create Criminal
```http
POST /criminals
Content-Type: application/json

{
  "name": "John Criminal",
  "age": 35,
  "gender": "Male",
  "alias": "Johnny C",
  "status": "AT_LARGE",
  "dangerLevel": "HIGH",
  "address": "Unknown",
  "identificationMarks": "Scar on left arm",
  "lastSeenLocation": "Downtown",
  "photoUrl": "https://example.com/photo.jpg"
}
```
**Required Role:** OFFICER or ADMIN

#### Update Criminal
```http
PUT /criminals/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "ARRESTED",
  "dangerLevel": "MEDIUM",
  "lastSeenLocation": "Police Station",
  "lastSeenDate": "2025-11-08T14:00:00Z"
}
```
**Required Role:** OFFICER or ADMIN

#### Delete Criminal
```http
DELETE /criminals/{id}
```
**Required Role:** ADMIN only

---

### 👥 User Management (Firebase Auth)

#### List All Users
```http
GET /auth/users
```
**Required Role:** ADMIN only

**Response:**
```json
{
  "users": [
    {
      "uid": "user123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://example.com/photo.jpg",
      "role": "OFFICER",
      "emailVerified": true,
      "disabled": false,
      "creationTimestamp": 1699000000,
      "lastSignInTimestamp": 1699100000
    }
  ],
  "count": 5
}
```

#### Get User by UID
```http
GET /auth/users/{uid}
```
**Required Role:** ADMIN only

#### Create User
```http
POST /auth/users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "displayName": "New User",
  "photoURL": "https://example.com/photo.jpg",
  "role": "OFFICER",
  "disabled": false
}
```
**Required Role:** ADMIN only
**Note:** Password must be at least 6 characters

#### Update User
```http
PUT /auth/users/{uid}
Content-Type: application/json

{
  "displayName": "Updated Name",
  "photoURL": "https://example.com/newphoto.jpg",
  "role": "ADMIN",
  "disabled": false
}
```
**Required Role:** ADMIN only

#### Delete User
```http
DELETE /auth/users/{uid}
```
**Required Role:** ADMIN only
**Note:** Cannot delete your own account

#### Update User Role
```http
PUT /auth/users/{uid}/role
Content-Type: application/json

{
  "role": "ADMIN"
}
```
**Required Role:** ADMIN only
**Valid Roles:** USER, OFFICER, ADMIN

#### Get Current User
```http
GET /auth/me
```
**Response:**
```json
{
  "uid": "user123",
  "role": "OFFICER"
}
```

#### Set Current User Role (Development Only)
```http
POST /auth/set-my-role
Content-Type: application/json

{
  "role": "ADMIN"
}
```
**Note:** Use only for development/testing. Log out and log in again to refresh token.

---

### 📊 Activity & Audit Logs

#### Get Recent Activity
```http
GET /activity?userId={userId}&entityType={type}&limit={limit}
```
**Query Parameters:**
- `userId`: Filter by user
- `entityType`: CRIME, FIR, CRIMINAL, USER, SETTINGS
- `limit`: Max results (default: 50)

**Response:**
```json
{
  "count": 10,
  "items": [
    {
      "activityId": "act123",
      "userId": "user123",
      "userName": "John Doe",
      "userRole": "OFFICER",
      "action": "CREATE",
      "entityType": "CRIME",
      "entityId": "crime123",
      "description": "Created new crime report",
      "timestamp": "2025-11-08T10:00:00Z",
      "ipAddress": "192.168.1.1"
    }
  ]
}
```

#### Log Activity
```http
POST /activity
Content-Type: application/json

{
  "action": "CREATE",
  "entityType": "CRIME",
  "entityId": "crime123",
  "description": "Created new crime report"
}
```

#### Get Activity Stats
```http
GET /activity/stats
```

---

### ⚙️ Settings Management

#### List Settings
```http
GET /settings?category={category}
```
**Query Parameters:**
- `category`: GENERAL, SECURITY, EMAIL, NOTIFICATIONS

**Response:**
```json
{
  "count": 5,
  "items": [
    {
      "settingId": "setting123",
      "key": "max_login_attempts",
      "value": "5",
      "description": "Maximum failed login attempts",
      "category": "SECURITY",
      "updatedAt": "2025-11-08T10:00:00Z",
      "updatedBy": "admin123"
    }
  ]
}
```

#### Get Setting by Key
```http
GET /settings/{key}
```

#### Create Setting
```http
POST /settings
Content-Type: application/json

{
  "key": "max_login_attempts",
  "value": "5",
  "description": "Maximum failed login attempts",
  "category": "SECURITY"
}
```
**Required Role:** ADMIN only

#### Update Setting
```http
PUT /settings/{key}
Content-Type: application/json

{
  "value": "10",
  "description": "Updated description"
}
```
**Required Role:** ADMIN only

#### Delete Setting
```http
DELETE /settings/{key}
```
**Required Role:** ADMIN only

#### Get Setting Categories
```http
GET /settings/categories
```

#### Bulk Update Settings
```http
POST /settings/bulk
Content-Type: application/json

{
  "settings": [
    { "key": "max_login_attempts", "value": "5" },
    { "key": "session_timeout", "value": "3600" }
  ]
}
```
**Required Role:** ADMIN only

---

## 🎭 Roles & Permissions

### USER
- View crimes
- Create crimes
- View FIRs
- Create FIRs
- View own profile

### OFFICER
- All USER permissions
- Update crimes
- Update FIRs
- Create/Update criminals
- View activity logs

### ADMIN
- All OFFICER permissions
- Delete crimes
- Delete FIRs
- Delete criminals
- Manage users (CRUD)
- Manage settings
- View all activity logs
- Full system access

---

## 📝 Enums

### CrimeStatus
- `REPORTED` - Initial state
- `INVESTIGATING` - Under investigation
- `SOLVED` - Case solved
- `CLOSED` - Case closed
- `COLD_CASE` - Unsolved case

### FIRStatus
- `PENDING` - Awaiting registration
- `REGISTERED` - FIR registered
- `INVESTIGATING` - Under investigation
- `EVIDENCE_COLLECTED` - Evidence collected
- `CHARGE_SHEET_FILED` - Charges filed
- `CLOSED` - Case closed

### CrimeCategory
- `THEFT`
- `ROBBERY`
- `ASSAULT`
- `MURDER`
- `FRAUD`
- `CYBERCRIME`
- `KIDNAPPING`
- `DRUG_TRAFFICKING`
- `DOMESTIC_VIOLENCE`
- `VANDALISM`
- `BURGLARY`
- `OTHER`

### CriminalStatus
- `AT_LARGE` - Not in custody
- `ARRESTED` - Recently arrested
- `IN_CUSTODY` - Currently detained
- `CONVICTED` - Sentenced
- `RELEASED` - Released from custody
- `WANTED` - Active warrant

### UserRole
- `USER` - Basic access
- `OFFICER` - Police officer
- `ADMIN` - System administrator

### CrimeSeverity
- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### DangerLevel
- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

---

## 🔥 Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2025-11-08T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": "Field 'title' is required"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2025-11-08T10:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication required",
  "details": "Invalid or missing Firebase token"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2025-11-08T10:00:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions",
  "details": "Admin role required"
}
```

### 404 Not Found
```json
{
  "timestamp": "2025-11-08T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Crime not found",
  "details": "Crime with id 'abc123' does not exist"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2025-11-08T10:00:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "details": "Database connection failed"
}
```

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd Backend
mvn spring-boot:run
```

### 2. Test Authentication
```bash
# Get Firebase ID token from frontend login
export TOKEN="your-firebase-id-token"

# Test endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/stats
```

### 3. Set Admin Role (First Time Setup)
```bash
# Login to frontend, get your UID from browser console
# Then call set-my-role endpoint:
curl -X POST http://localhost:8080/api/auth/set-my-role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"ADMIN"}'

# Logout and login again to refresh token
```

---

## 📚 Additional Resources

- **Frontend Repository**: `/frontend`
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Authentication
- **Framework**: Spring Boot 3.x
- **Java Version**: 17+

---

## 🔗 Related Documentation

- [Backend README](./Backend/README.md)
- [Frontend README](./frontend/README.md)
- [Root README](./README.md)

---

**Last Updated:** November 8, 2025
**API Version:** 1.0.0
