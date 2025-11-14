# Crime Record Management Portal
# Crime Portal — Full Project (College 5th sem)

This repository contains the Crime Portal full-stack application: a modern platform for filing and managing crime
reports, FIRs and criminal records. The repo contains two main parts:

- `Backend/` — Spring Boot REST API (authentication via Firebase Admin SDK)
- `frontend/` — React application (MUI, Framer Motion, Recharts) using Firebase Authentication

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

## Architecture

- Frontend: React (v18), Material UI (v5), Framer Motion, Recharts
- Backend: Spring Boot, JPA/Hibernate, Firebase Admin SDK (JWT verification)
- Database: MySQL (or PostgreSQL) for primary data store
- Authentication: Firebase Auth for user sign-in and token issuance

---

## Quick start (development)

Prerequisites:

- Java 17+
- Maven or Gradle (wrapper recommended)
- Node.js 16+
- MySQL or PostgreSQL
- Firebase project (for Auth)

1. Clone the repository and open a terminal (PowerShell):

```powershell
git clone <your-repo-url>
cd "Java Project"
```

2. Prepare the database (example with MySQL):

```powershell
# create database
mysql -u root -p -e "CREATE DATABASE crimeportal CHARACTER SET utf8mb4;"
```

3. Configure environment variables for backend and frontend (see sections below).

4. Start Backend and Frontend in separate terminals:

Backend (PowerShell):

```powershell
cd Backend
mvn clean install
mvn spring-boot:run
```

Frontend (PowerShell):

```powershell
cd frontend
npm install
npm run start
```

Open `http://localhost:3000` for the frontend and `http://localhost:8080` for backend APIs.

---

## Environment variables summary

Backend (store securely on server / local dev env):

- `SPRING_DATASOURCE_URL` — e.g. `jdbc:mysql://localhost:3306/crimeportal`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` — internal JWT secret (if used)
- `FIREBASE_SERVICE_ACCOUNT` — path to Firebase service account JSON
- `SERVER_PORT` — e.g., `8080`

Frontend (put in `frontend/.env` or environment for hosting):

- `REACT_APP_API_BASE_URL` — e.g. `http://localhost:8080`
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

---

## Running Backend

See `Backend/README.md` for details about building, running, testing, database migrations and Firebase Admin configuration.

---

## Running Frontend

See `frontend/README.md` for quick start and deployment instructions.

---

## Running both together (recommended)

1. Start DB and ensure the backend `SPRING_DATASOURCE_URL` points to it.
2. Start the backend server and confirm health (e.g., `GET /actuator/health` or base root).
3. Start the frontend with `REACT_APP_API_BASE_URL` set to backend URL.

Optional: use Docker Compose to orchestrate DB + backend + (optional) reverse proxy. Tell me if you want a `docker-compose.yml` scaffold.

---

## Database & Firebase setup

- Create the database and user. Run migrations (Flyway/Liquibase) if the project uses them.
- For Firebase: create a Firebase project, enable Email/Password sign-in (or providers you need), and create a Service Account. Provide the service account JSON to the backend and the client-side config to the frontend via env vars.

---

## Deployment notes

- Backend: build a production JAR (`mvn package -DskipTests`) and deploy on a JVM host, container, or PaaS (Heroku/Railway/AWS ECS). Use environment variables for secrets.
- Frontend: `npm run build` and host static files on Netlify, Vercel, S3+CloudFront, or any static host.
- Use HTTPS in production and add CORS policy on the backend to allow your frontend origin.

---

## Team Members

This is a college project developed by:

1. **Ayush Gangwar** - Project Lead & Full Stack Developer
2. **Pratham Kumar** - Assistant Lead & Backend Developer
3. **Jatin Sharma** - Frontend Developer
4. **Neha Gangwar** - UI/UX Designer & Frontend Developer
5. **Pallavi Gangwar** - Database Administrator
6. **Aditya Raj** - Testing & Quality Assurance
7. **Sanjeev Maurya** - Documentation & API Testing

---

## Contributing

- Use feature branches and descriptive commit messages.
- Run tests locally and include small focused PRs.
- Update README sections if you change deploy or env requirements.

---

## Troubleshooting

- Backend DB errors: check DB URL, credentials, and that DB accepts connections.
- Firebase auth fails: ensure service account JSON and client-side config match the same Firebase project.
- CORS issues: configure backend CORS to accept frontend origin.

---

## Contact

- Ops / Maintainers: arya119000@gmail.com
- Frontend: arya119000@gmail.com
- Backend: arya119000@gmail.com

---

## License

Add your preferred license information here (MIT, Apache-2.0, etc.).
