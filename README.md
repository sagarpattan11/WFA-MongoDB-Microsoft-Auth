# Workforce Analytics Platform (WFA)

> **Enterprise-Grade Workforce Analytics, Attendance, Scheduling, Compliance, and Payroll Management Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.19+-green.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-brightgreen.svg)](https://www.mongodb.com/)
[![WebAuthn / Passkeys](https://img.shields.io/badge/Auth-WebAuthn%20%2F%20FIDO2-orange.svg)](https://fidoalliance.org/fido2/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Project Overview

The **Workforce Analytics Platform (WFA)** is a multi-tenant enterprise system delivering real-time workforce intelligence, organizational telemetry, attendance tracking, shift scheduling, automated compliance auditing, and payroll visibility.

### Key Architectural Pillars:
1. **Passwordless WebAuthn / Passkey & FIDO2 Authentication**: Modern, cryptographic authentication using **Windows Hello, Apple Touch ID / Face ID, Android Biometrics, and USB/NFC FIDO2 Hardware Keys (YubiKey)**.
2. **MongoDB Persistence & Aggregation**: High-performance database layer with Mongoose connection pooling, automatic initial seeding, and rich aggregation pipelines powering live analytics.
3. **Enterprise Employee Management**: Full CRUD operations with live text search, department & team filters, status transitions, and audit-compliant soft deletions.
4. **Live Workforce Telemetry**: **8 Live KPI metric cards** and **6 interactive Recharts visualizations** dynamically aggregated from real MongoDB documents.

---

## 🛠 Technology Stack

### **Frontend**
- **Framework & Language**: React 18, TypeScript 5 (Strict Mode), Vite
- **Authentication**: `@simplewebauthn/browser` (FIDO2 Passkeys)
- **State & Data Fetching**: Redux Toolkit, React-Redux, TanStack React Query v5
- **Routing**: React Router v6 with session guards (`RequireAuth`)
- **UI System & Icons**: Material UI v5, Lucide React, Emotion
- **Data Visualization**: Recharts (Bar, Area, Pie, Donut charts)
- **Testing**: Vitest, React Testing Library (16 passing tests)

### **Backend**
- **Runtime & Framework**: Node.js, Express, TypeScript (Strict Mode)
- **Database & ODM**: MongoDB, Mongoose with connection pooling
- **Authentication Engine**: `@simplewebauthn/server` (Cryptographic verification, challenge generation, counter validation)
- **Session Management**: `express-session` backed by `connect-mongo` (HttpOnly, encrypted cookies)
- **Security Middlewares**: Helmet, CORS with credentials, Express Rate Limiter, Cookie Parser
- **Device & Audit Telemetry**: `ua-parser-js` and MongoDB `AuthAuditLog` collection
- **Testing**: Vitest, Supertest (10 passing tests)

---

## 📂 Project Structure

```text
wfa-project/
├── frontend/
│   ├── src/
│   │   ├── api/               # Centralized Axios client & API endpoints
│   │   ├── app/               # Redux store & typed hooks
│   │   ├── auth/              # WebAuthn client service & RBAC definitions
│   │   ├── components/        # Design system, KPI cards, tables, feedback screens
│   │   ├── features/          # Domain pages (Auth, Dashboard, Employees, Settings)
│   │   ├── routes/            # Route manifest & RequireAuth guards
│   │   └── theme/             # Light & Dark themes with localStorage persistence
├── backend/
│   └── src/
│       ├── config/            # Env validation (Zod), Logger, MongoDB connection
│       ├── middleware/        # Security, Rate Limiter, Error, Auth Session
│       ├── modules/
│       │   ├── auth/          # WebAuthn Passkey registration, login, credentials
│       │   ├── employees/     # Employee CRUD, search, filter, soft delete
│       │   ├── departments/   # Department management APIs
│       │   ├── teams/         # Team management APIs
│       │   └── dashboard/     # 8 KPI & 6 Chart MongoDB aggregation pipelines
│       ├── scripts/           # Automatic database seed utility
│       ├── routes/            # Central API route definitions
│       └── server.ts          # Server bootstrap & lifecycle management
├── docs/architecture/         # Architectural specs & Mermaid sequence diagrams
├── .env.example
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

Create `.env` in the root folder or use the default configurations:

```env
# Server Runtime
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/wfa_db

# WebAuthn / Passkey Relying Party Config
RP_NAME=Workforce Analytics Platform
RP_ID=localhost
ORIGIN=http://localhost:3000

# Session Security
SESSION_SECRET=wfa-passkey-session-secret-enterprise-grade
```

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Run Development Servers
To start **both** Frontend and Backend concurrently with hot-reload:

```bash
npm run dev
```

- 🌐 **Frontend Application**: [**http://localhost:3000**](http://localhost:3000)
- ⚙️ **Backend API**: [**http://localhost:5000/api/v1/health**](http://localhost:5000/api/v1/health)

---

## 💻 Development & Quality Commands

| Command | Action | Status |
| :--- | :--- | :--- |
| `npm run dev` | Runs Frontend (`:3000`) and Backend (`:5000`) concurrently | ✅ Verified Live |
| `npm run typecheck` | Runs TypeScript compilation in strict mode | ✅ 0 Errors |
| `npm run lint` | Runs ESLint across entire monorepo | ✅ 0 Errors, 0 Warnings |
| `npm test` | Executes full Vitest unit test suite (26 tests) | ✅ 26/26 Passing |
| `npm run build` | Builds optimized production bundles in `dist/` | ✅ Clean Bundles |

---

## 🔑 WebAuthn / Passkey Device & Browser Compatibility

| Platform | Supported Authenticators | Supported Browsers | Notes |
| :--- | :--- | :--- | :--- |
| **Windows 10 / 11** | Windows Hello (Fingerprint, Face, PIN), YubiKey USB/NFC | Chrome, Edge, Firefox, Brave | Built-in Windows Hello platform authenticator. |
| **macOS (Ventura+)** | Touch ID, Apple Watch, YubiKey USB/NFC | Safari, Chrome, Edge, Firefox | Cross-device passkeys via iCloud Keychain. |
| **iOS / iPadOS (16+)** | Face ID, Touch ID, NFC Security Keys | Safari, Chrome | Hardware security keys via Lightning/USB-C/NFC. |
| **Android (9+)** | Screen Lock (Fingerprint, Face, PIN), FIDO2 NFC | Chrome, Edge, Firefox | Google Password Manager cross-device sync. |
| **Linux** | YubiKey, Nitrokey, SoloKey USB/NFC | Chrome, Firefox, Chromium | Requires `libfido2` / `udev` rules. |

---

## 📊 Live Dashboard Telemetries & KPIs

The dashboard aggregates real MongoDB documents to compute:

### 8 KPI Metrics:
1. **Total Employees**: Non-deleted employee records.
2. **Active Employees**: Employees with status `active`.
3. **Total Departments**: Department business units.
4. **Total Teams**: Functional operational teams.
5. **Employees Present Today**: On-duty headcount.
6. **Employees on Leave**: Staff on approved leave.
7. **New Hires**: Employees hired within the last 90 days.
8. **Attendance Percentage**: Calculated as `(Present / Active) * 100`.

### 6 Interactive Recharts Visualizations:
1. **Employees by Department** (Color-coded Bar Chart)
2. **Employees by Location** (Horizontal Bar Chart)
3. **Employment Type Distribution** (Donut Chart)
4. **Cumulative Employee Growth** (Smooth Area Chart)
5. **Employee Status Distribution** (Pie Chart)
6. **Recent Hiring Trend** (Monthly Bar Chart)

---

## 🔒 Security & Privacy Commitments

1. **Zero Biometric Exposure**: Fingerprints, Face scans, and Device PINs never leave the client device and are never sent to or stored on the server.
2. **Asymmetric Cryptography**: The server stores only public keys and signature counters in MongoDB.
3. **Phishing-Resistant Binding**: All authentication ceremonies verify origin (`http://localhost:3000`) and Relying Party ID (`RP_ID`).
4. **Encrypted Session Cookies**: Sessions are stored in MongoDB with HttpOnly, SameSite=Lax flags.
5. **Audit Logging**: Every authentication attempt (success/failure, device type, IP, timestamp) is recorded in `AuthAuditLog`.
