# 🚔 Crime Record Management Portal

<div align="center">

![Java](https://img.shields.io/badge/Java-17+-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-yellow?style=for-the-badge&logo=firebase)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge&logo=mysql)

**A Modern Full-Stack Crime Management System**

*College Project | B.Tech Computer Science*

[📖 Documentation](#table-of-contents) • [🚀 Quick Start](#quick-start-development) • [👥 Team](#team-members) • [📧 Contact](#contact)

</div>

---

## 📋 Overview

Crime Portal is a comprehensive full-stack web application designed to modernize the process of filing and managing crime reports, FIRs (First Information Reports), and criminal records. Built as a college project, this platform demonstrates the integration of modern web technologies to create a secure, role-based crime management system.

### 🎯 Key Features

- 🔐 **Secure Authentication** - Firebase Authentication with JWT verification
- 👥 **Role-Based Access Control** - ADMIN, OFFICER, and USER roles with granular permissions
- 📝 **FIR Management** - Complete lifecycle management of First Information Reports
- 🔍 **Criminal Records** - Comprehensive criminal database with search functionality
- 📊 **Analytics Dashboard** - Interactive charts and statistics for crime data analysis
- 📱 **Responsive Design** - Modern UI that works seamlessly across devices
- 🔔 **Activity Logging** - Comprehensive audit trail of system activities

### 🏗️ Project Structure

This repository contains two main components:

- **`Backend/`** — Spring Boot REST API with Firebase Admin SDK for authentication
- **`frontend/`** — React SPA with Material-UI, Framer Motion, and Recharts

---

## Table of Contents

- Project overview
- Architecture
- Quick start (development)
- Environment variables summary
- Running Backend
- Running Frontend
- Running both together (recommended)
- Database & Firebase setup
- Deployment notes
- Contributing
- Troubleshooting
- License & Contact

---

## Project overview

Crime Portal enables citizens to report crimes and allows authorized personnel (OFFICER, ADMIN) to manage and
investigate reports. The frontend is a single-page React app; the backend is a stateless REST API.

Key features:

- Role-based access control (ADMIN / OFFICER / USER)
- File FIRs and manage case workflow
- Secure authentication via Firebase Authentication
- Interactive dashboards and charts for analytics

---

## 🏛️ Architecture

### Technology Stack

#### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Animation**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API

#### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **ORM**: JPA/Hibernate
- **Security**: Spring Security + Firebase Admin SDK
- **Build Tool**: Maven
- **API Style**: RESTful

#### Database & Authentication
- **Database**: MySQL (PostgreSQL compatible)
- **Authentication**: Firebase Authentication
- **Authorization**: JWT token-based with role verification

### System Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │ HTTP │ Spring Boot  │ JDBC │   MySQL     │
│  Frontend   │◄────►│   Backend    │◄────►│  Database   │
│             │      │   REST API   │      │             │
└─────────────┘      └──────────────┘      └─────────────┘
       │                    │
       │                    │
       └────────┬───────────┘
                │
                ▼
         ┌─────────────┐
         │  Firebase   │
         │    Auth     │
         └─────────────┘
```

---

## 🚀 Quick Start (Development)

### Prerequisites

Ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| ☕ Java JDK | 17+ | Backend runtime |
| 📦 Maven | 3.6+ | Backend build tool |
| 🟢 Node.js | 16+ | Frontend runtime |
| 🗄️ MySQL | 8.0+ | Database |
| 🔥 Firebase Project | - | Authentication |

### 🔧 Installation Steps

#### 1️⃣ Clone the Repository

```powershell
git clone https://github.com/Arya182-ui/crime_portal.git
cd crime_portal
```

#### 2️⃣ Database Setup

Create the database:

```powershell
# MySQL
mysql -u root -p -e "CREATE DATABASE crimeportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### 3️⃣ Backend Configuration

Create `Backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crimeportal
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

Add your Firebase service account JSON file to `Backend/` directory.

#### 4️⃣ Frontend Configuration

Create `frontend/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### 5️⃣ Start the Application

**Terminal 1 - Backend:**

```powershell
cd Backend
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

**Terminal 2 - Frontend:**

```powershell
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

#### 6️⃣ Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **API Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (if configured)

---

## 🔐 Environment Variables

### Backend Configuration

Create these environment variables or add to `application.properties`:

| Variable | Example | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/crimeportal` | Database connection URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `password123` | Database password |
| `JWT_SECRET` | `your-secret-key` | Internal JWT secret |
| `FIREBASE_SERVICE_ACCOUNT` | `/path/to/serviceAccount.json` | Firebase Admin SDK credentials |
| `SERVER_PORT` | `8080` | Backend server port |

### Frontend Configuration

Create `frontend/.env` with these variables:

| Variable | Example | Description |
|----------|---------|-------------|
| `REACT_APP_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |
| `REACT_APP_FIREBASE_API_KEY` | `AIza...` | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `project.firebaseapp.com` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | `your-project-id` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `project.appspot.com` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | `1:123:web:abc` | Firebase app ID |

> ⚠️ **Security Note**: Never commit `.env` files or credentials to version control. Use `.gitignore` to exclude them.

---

## 📁 Project Structure

### Backend (`Backend/`)

```
Backend/
├── src/main/java/com/arya/crimeportal/
│   ├── Application.java              # Main Spring Boot application
│   ├── config/                       # Configuration classes
│   │   ├── CorsConfig.java
│   │   ├── FirebaseConfig.java
│   │   └── SecurityConfig.java
│   ├── controller/                   # REST API endpoints
│   │   ├── AuthController.java
│   │   ├── CrimeController.java
│   │   ├── FirController.java
│   │   └── ...
│   ├── model/                        # JPA entities
│   ├── service/                      # Business logic
│   ├── security/                     # Security filters & JWT
│   └── util/                         # Utility classes
├── src/main/resources/
│   └── application.properties        # App configuration
└── pom.xml                           # Maven dependencies
```

### Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── components/                   # Reusable components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── ProtectedRoute.js
│   ├── pages/                        # Page components
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Crimes.js
│   │   └── ...
│   ├── services/                     # API service layer
│   │   └── api.js
│   ├── context/                      # React context
│   │   └── AuthContext.js
│   ├── App.js                        # Main app component
│   └── index.js                      # Entry point
├── public/
└── package.json                      # NPM dependencies
```

## 🔗 API Endpoints

See `Backend/API_ENDPOINTS.md` for complete API documentation.

### Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | User registration | ❌ |
| GET | `/api/crimes` | Get all crimes | ✅ |
| POST | `/api/crimes` | Create new crime | ✅ OFFICER |
| GET | `/api/firs` | Get all FIRs | ✅ |
| POST | `/api/firs` | File new FIR | ✅ |
| GET | `/api/dashboard/stats` | Get statistics | ✅ |

## 🧪 Testing

### Backend Tests

```powershell
cd Backend
mvn test
```

### Frontend Tests

```powershell
cd frontend
npm test
```

## 📦 Building for Production

### Backend

```powershell
cd Backend
mvn clean package -DskipTests
# Output: target/crimeportal.jar
```

### Frontend

```powershell
cd frontend
npm run build
# Output: build/ directory
```

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the wizard
3. Enable Google Analytics (optional)

### Step 2: Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable other providers as needed

### Step 3: Get Configuration

**For Frontend:**
1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" and click the web icon `</>`
3. Copy the configuration object to `frontend/.env`

**For Backend:**
1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file as `serviceAccount.json` in `Backend/` directory

### Step 4: Security Rules

Set appropriate Firestore/Storage security rules in the Firebase Console.

---

## 🚀 Deployment

### Backend Deployment Options

#### Option 1: Heroku
```powershell
# Install Heroku CLI and login
heroku create your-app-name
heroku addons:create cleardb:ignite  # MySQL
git push heroku main
```

#### Option 2: Railway
1. Connect GitHub repository
2. Add MySQL database
3. Set environment variables
4. Deploy automatically on push

#### Option 3: Docker
```dockerfile
# Dockerfile example
FROM openjdk:17-slim
COPY target/crimeportal.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Frontend Deployment Options

#### Option 1: Vercel
```powershell
cd frontend
npm install -g vercel
vercel --prod
```

#### Option 2: Netlify
```powershell
cd frontend
npm run build
# Drag and drop the build/ folder to Netlify
```

#### Option 3: GitHub Pages
```powershell
npm install gh-pages --save-dev
# Add to package.json scripts: "deploy": "gh-pages -d build"
npm run deploy
```

### Production Checklist

- [ ] Set all environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production frontend URL
- [ ] Set up database backups
- [ ] Configure Firebase security rules
- [ ] Update API base URL in frontend
- [ ] Test all API endpoints
- [ ] Set up monitoring and logging

---

## 👥 Team Members

<div align="center">

### 🎓 College Project Team - B.Tech Computer Science

</div>

| Name | Role | Responsibilities |
|------|------|------------------|
| **Ayush Gangwar** | 🎯 Project Lead & Full Stack Developer | Overall architecture, Backend & Frontend development |
| **Pratham Kumar** | 🔧 Assistant Lead & Backend Developer | Spring Boot APIs, Database design |
| **Jatin Sharma** | 💻 Frontend Developer | React components, UI implementation |
| **Neha Gangwar** | 🎨 UI/UX Designer & Frontend Developer | Design system, User experience |
| **Pallavi Gangwar** | 🗄️ Database Administrator | Database schema, Query optimization |
| **Aditya Raj** | 🧪 Testing & Quality Assurance | Test cases, Bug tracking |
| **Sanjeev Maurya** | 📚 Documentation & API Testing | Documentation, API validation |

---

## 🤝 Contributing

We welcome contributions from the community! This project was created as a college project, but we're open to improvements.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```powershell
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```powershell
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to the branch**
   ```powershell
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Write clear, descriptive commit messages
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Keep PRs focused and small

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Problem**: Database connection error
```
Solution: 
- Check MySQL is running: net start MySQL
- Verify database exists: CREATE DATABASE crimeportal;
- Check credentials in application.properties
```

**Problem**: Firebase authentication fails
```
Solution:
- Ensure serviceAccount.json is in Backend/ directory
- Verify Firebase project ID matches in both frontend and backend
- Check Firebase Authentication is enabled in console
```

**Problem**: Port 8080 already in use
```
Solution:
- Change port in application.properties: server.port=8081
- Or stop the process using: netstat -ano | findstr :8080
```

#### Frontend Issues

**Problem**: CORS errors when calling API
```
Solution:
- Check CorsConfig.java allows your frontend origin
- Verify REACT_APP_API_BASE_URL in .env is correct
```

**Problem**: Firebase configuration error
```
Solution:
- Double-check all Firebase env variables in .env
- Ensure no extra spaces or quotes in .env values
- Verify Firebase project settings match
```

**Problem**: Build fails with memory error
```
Solution:
- Increase Node memory: $env:NODE_OPTIONS="--max-old-space-size=4096"
- Clear cache: npm cache clean --force
```

### Still Having Issues?

- Check the [Issues](https://github.com/Arya182-ui/crime_portal/issues) page
- Create a new issue with detailed error logs
- Contact the team (see below)

---

## 📄 License

This project is created as a college project for educational purposes. 

**MIT License** - Feel free to use this project for learning and educational purposes.

---

## 🙏 Acknowledgments

- **Firebase** - For authentication and real-time database
- **Spring Boot** - For robust backend framework
- **React** - For powerful frontend library
- **Material-UI** - For beautiful UI components
- **Our College** - For project guidance and support
- **Open Source Community** - For amazing tools and libraries

---

## 📧 Contact

<div align="center">

### Get in Touch

**Email**: arya119000@gmail.com

**GitHub**: [@Arya182-ui](https://github.com/Arya182-ui)

**Project Repository**: [crime_portal](https://github.com/Arya182-ui/crime_portal)

---
### ⭐ Star this repository if you find it helpful!
*For bug reports and feature requests, please use the [GitHub Issues](https://github.com/Arya182-ui/crime_portal/issues) page.*

</div>
