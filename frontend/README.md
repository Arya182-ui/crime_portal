# Crime Portal — Frontend

This document explains how to set up and run the Frontend for the Crime Portal project (React + MUI + Framer Motion).

---

## Table of Contents

- About
- Requirements
- Installation
- Environment variables
- Development server
- Production build
- Linting & Tests
- Structure
- Firebase config
- Deployment
- Troubleshooting
- Contributing

---

## About

The frontend is built with React (v18), Material-UI (v5) for components, Framer Motion for animations, and Recharts for charts. It communicates with the Backend APIs and uses Firebase Authentication for user sign-in.

---

## Requirements

- Node.js 16+ (recommend using LTS) and npm or yarn
- A running Backend server (see `Backend/README.md`)
- Firebase project for authentication

---

## Installation

From the workspace root:

```powershell
cd frontend
npm install
# or
# yarn install
```

This will install dependencies including MUI, framer-motion, and recharts if present.

---

## Environment variables

Create a `.env` (or `.env.development`) file in the `frontend` folder for runtime configuration. Example variables:

```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

Replace the above values with your Firebase project configuration.

---

## Development server

Start the dev server with hot reload:

```powershell
cd frontend
npm run start
# or if using create-react-app scripts
# npm run dev
```

Open `http://localhost:3000` (or the port shown in the terminal).

---

## Production build

Build the app for production:

```powershell
cd frontend
npm run build
```

This produces a `build/` folder that you can serve with any static hosting provider (Nginx, Netlify, Vercel, S3, etc.).

---

## Linting & Tests

If ESLint and tests are configured, run:

```powershell
npm run lint
npm run test
```

Adjust commands if your project uses different script names.

---

## Project Structure (high level)

```
frontend/
├─ src/
│  ├─ components/     # Shared UI components (Header, Footer, Cards)
│  ├─ pages/          # Route pages (Login, Register, Dashboard, Documentation...)
│  ├─ context/        # React Contexts (AuthContext, Theme)
│  ├─ services/       # API clients / helpers
│  ├─ hooks/          # Custom hooks
│  ├─ theme.js        # centralized MUI theme (if present)
│  └─ index.js
├─ public/
├─ package.json
└─ README.md
```

---

## Firebase Authentication

1. Create a Firebase project and enable Email/Password (and other providers if needed).
2. Copy the web config values into `.env` (see above).
3. The app uses Firebase Auth in the frontend to sign in users and receives JWT tokens which are sent to the backend for verification.

---

## Deployment

- Vercel/Netlify: connect the repo and set environment variables in the dashboard. Build command: `npm run build`, publish: `build/`.
- Static server (Nginx): build and copy the `build/` directory to the static root.

Example `netlify.toml` (optional):

```toml
[build]
  command = "npm run build"
  publish = "build"
```

---

## Troubleshooting

- CORS issues: ensure backend allows requests from the frontend origin.
- Firebase config issues: confirm the API key and project settings in `.env`.
- Chart/rendering issues: check console for errors; ensure `recharts` is installed and imported correctly.

---

## Contributing

- Use feature branches
- Keep UI changes componentized
- Add unit tests and small integration tests for critical flows

---

## Contact

Frontend & UI questions: frontend@crimeportal.gov

---

## License

Add project license details here.
