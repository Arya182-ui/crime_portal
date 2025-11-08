# Crime Portal — Backend

This document explains how to set up, run and maintain the Backend service for the Crime Portal project.

---

## Table of Contents

- About
- Requirements
- Configuration (env / application.properties)
- Running locally
- Running tests
- Database & Migrations
- Firebase / Authentication
- API Overview
- Docker (optional)
- Troubleshooting
- Contributing
- License & Contact

---

## About

The Backend is a Spring Boot (Java) application exposing REST APIs used by the frontend and other services. It handles user authentication/authorization, crime reports, FIRs, criminal records, and administrative operations.

This README assumes standard Spring Boot project layout with Maven or Gradle.

---

## Requirements

- Java 17+ (LTS) installed and `JAVA_HOME` set
- Maven 3.8+ or Gradle (wrapper included if applicable)
- Node/npm only required for front-end (see Frontend README)
- MySQL 8.x (or PostgreSQL) for production data (adjust properties as needed)
- Firebase service account JSON if using Firebase Admin SDK

---

## Configuration

The application reads configuration from `src/main/resources/application.properties` (or `application.yml`) and environment variables. Recommended to use profiles (dev/test/prod).

Important environment variables (examples):

- SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/crimeportal
- SPRING_DATASOURCE_USERNAME=root
- SPRING_DATASOURCE_PASSWORD=secret
- SPRING_JPA_HIBERNATE_DDL_AUTO=update
- JWT_SECRET=your_jwt_secret_here
- FIREBASE_SERVICE_ACCOUNT=/path/to/firebase-service-account.json
- SERVER_PORT=8080

For local development you can set these in your IDE run configuration or export them in your shell. Example using PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL = 'jdbc:mysql://localhost:3306/crimeportal'
$env:SPRING_DATASOURCE_USERNAME = 'root'
$env:SPRING_DATASOURCE_PASSWORD = 'password'
$env:JWT_SECRET = 'dev-secret'
```

If the project uses externalized secrets (Vault, Kubernetes Secrets), prefer that for production.

---

## Running Locally

Using Maven:

```powershell
cd Backend
mvn clean install
mvn spring-boot:run
```

Or with Gradle wrapper (if present):

```powershell
cd Backend
./gradlew bootRun    # on Windows: gradlew.bat bootRun
```

By default the app starts on port `8080` (configurable with `SERVER_PORT`). The base API will be available at `http://localhost:8080`.

---

## Running Tests

Run unit & integration tests with:

```powershell
cd Backend
mvn test
```

Or with Gradle:

```powershell
./gradlew test
```

---

## Database & Migrations

The project expects a relational database. Recommended approach:

- Use MySQL for local development (or PostgreSQL if configured).
- Use Flyway or Liquibase for schema migrations (check `pom.xml`/build.gradle for dependencies).

Example local setup (MySQL):

```powershell
# create database
mysql -u root -p -e "CREATE DATABASE crimeportal CHARACTER SET utf8mb4;"
```

Set the datasource URL accordingly and run the app — the JPA/Hibernate config may auto-create/validate schema depending on `spring.jpa.hibernate.ddl-auto`.

---

## Firebase / Authentication

This project integrates Firebase Authentication (frontend) and Firebase Admin SDK (backend) for verification of tokens and user management. To configure:

1. Create a Firebase project and generate a Service Account key JSON file.
2. Place the file on the backend server and set `FIREBASE_SERVICE_ACCOUNT` to the path.
3. Ensure the service account has permissions to verify tokens and access necessary Firebase features.

The backend validates JWTs from the frontend and maps roles (ADMIN, OFFICER, USER). See `Auth`/`Security` modules for implementation details.

---

## API Overview

The backend exposes REST endpoints for core resources. A subset:

- `POST /api/auth/login` — authenticate/login (if using internal auth)
- `POST /api/users` — register user
- `GET /api/crimes` — list crimes
- `POST /api/crimes` — create crime report
- `GET /api/fir` — list FIRs
- `POST /api/fir` — file an FIR
- `GET /api/criminals` — list criminals
- `PUT /api/users/{id}` — update user profile

For full API reference, consult the controller layer or OpenAPI/Swagger endpoint (if enabled): `http://localhost:8080/swagger-ui.html` or `/v3/api-docs`.

---

## Docker (optional)

You can containerize the backend using a simple Dockerfile (example):

```dockerfile
FROM eclipse-temurin:17-jdk-focal
WORKDIR /app
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

Build and run:

```powershell
cd Backend
mvn clean package -DskipTests
docker build -t crimeportal-backend .
docker run -e SPRING_DATASOURCE_URL='jdbc:mysql://host:3306/crimeportal' -e JWT_SECRET='prod-secret' -p 8080:8080 crimeportal-backend
```

---

## Troubleshooting

- Database connection errors: verify URL, credentials, and that the DB server accepts remote connections.
- Firebase auth errors: ensure service account JSON path is correct and file has proper permissions.
- Port in use: change `SERVER_PORT` or stop the conflicting service.
- Migration issues: check Flyway/Liquibase history table and migration SQL.

---

## Contributing

- Follow project coding standards.
- Create feature branches and open PRs into `main`.
- Add tests for new functionality.

---

## Contact

For backend architecture or deployment questions, contact the project maintainers (update with correct email/address):

- arya119000@gmail.com

---

## License

Add license information here (e.g., MIT, Apache-2.0) as required by your organization.
