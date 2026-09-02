# Workforce Analytics Platform (WFA)

> **Enterprise-Grade Workforce Analytics, Attendance, Scheduling, Compliance, and Payroll Management Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.19+-green.svg)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Project Objective

The **Workforce Analytics Platform (WFA)** is a multi-tenant enterprise system designed to deliver real-time workforce visibility, granular attendance and absence tracking, dynamic shift scheduling, automated compliance audits, and payroll intelligence.

Built from the ground up for strict enterprise security, the platform integrates **Microsoft Entra ID** authentication (SSO, passwordless, and MFA), a centralized **Role-Based Access Control (RBAC)** model spanning 5 core enterprise tiers, and real-time operational telemetries via **Socket.IO**.

---

## 🛠 Technology Stack

### **Frontend**
- **Core**: React 18+, TypeScript 5+ (Strict Mode), Vite
- **State & Data Fetching**: Redux Toolkit, React-Redux, TanStack React Query v5
- **Routing**: React Router v6
- **UI System**: Material UI v5, Lucide React, Emotion
- **Forms & Validation**: React Hook Form, Zod
- **Networking & Realtime**: Axios, Socket.IO Client
- **Data Visualization**: Recharts
- **Testing**: Vitest, React Testing Library, Playwright

### **Backend Foundation**
- **Runtime & Framework**: Node.js, Express, TypeScript (Strict Mode)
- **Security**: Helmet, CORS, Express Rate Limit, Cookie Parser
- **Validation**: Zod (Environment & Request Payload Schemas)
- **Logging**: Morgan & structured console logging
- **Realtime Engine**: Socket.IO
- **Testing**: Vitest, Supertest

---

## 📂 Project Structure

```text
wfa-project/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/               # Centralized Axios client & API endpoints
│       ├── app/               # Store setup & global hooks
│       ├── assets/            # Static media and brand assets
│       ├── auth/              # RBAC definitions & Entra ID types
│       ├── components/        # Reusable design system & UI components
│       │   ├── common/        # Buttons, Inputs, Cards, Modals, Tables
│       │   ├── feedback/      # Loaders, Skeletons, ErrorBoundary, 403, 404, 500
│       │   ├── layout/        # AppShell, Header, Sidebar, Breadcrumbs
│       │   └── navigation/    # Navigation guards & menu items
│       ├── config/            # Frontend environment configuration
│       ├── features/          # Domain-specific feature modules
│       │   ├── admin/
│       │   ├── analytics/
│       │   ├── attendance/
│       │   ├── compliance/
│       │   ├── employee/
│       │   ├── hr/
│       │   ├── manager/
│       │   ├── payroll/
│       │   ├── scheduling/
│       │   └── team-lead/
│       ├── hooks/             # Custom utility & lifecycle hooks
│       ├── layouts/           # AuthLayout and MainLayout
│       ├── routes/            # Route manifest & guards
│       ├── services/          # Business logic services
│       ├── store/             # Redux slices (auth, ui, theme)
│       ├── styles/            # Global CSS styling
│       ├── theme/             # Design tokens, light & dark theme palettes
│       ├── types/             # Shared TypeScript types
│       ├── utils/             # Formatters, helpers, safe storage
│       ├── App.tsx            # Main application router wrapper
│       └── main.tsx           # React entrypoint
├── backend/
│   └── src/
│       ├── config/            # Environment validation & logger setup
│       ├── controllers/       # Route request handlers
│       ├── middleware/        # Error handler, 404, Security, Logger
│       ├── modules/           # Feature business domains
│       ├── routes/            # Central API route definitions
│       ├── services/          # Core backend services
│       ├── sockets/           # Socket.IO connection and event handlers
│       ├── types/             # Backend TypeScript interfaces
│       ├── utils/             # API response formatters
│       ├── app.ts             # Express app instance configuration
│       └── server.ts          # Server bootstrap & lifecycle management
├── docs/
│   └── architecture/          # Architectural specifications & diagrams
│       ├── system-architecture.md
│       ├── frontend-architecture.md
│       ├── backend-architecture.md
│       ├── authentication-flow.md
│       ├── authorization-flow.md
│       └── realtime-flow.md
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

Copy the `.env.example` template to `.env` in the root (or frontend/backend directories as needed):

```bash
cp .env.example .env
```

| Variable | Description | Stage Active |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | Task 1+ |
| `FRONTEND_PORT` | Port for the Vite dev server (default: `3000`) | Task 1+ |
| `BACKEND_PORT` | Port for the Express API server (default: `5000`) | Task 1+ |
| `VITE_API_BASE_URL` | Base API URL for frontend HTTP client (`http://localhost:5000/api/v1`) | Task 1+ |
| `VITE_SOCKET_URL` | Socket.IO server URL (`http://localhost:5000`) | Task 1+ |
| `MONGODB_URI` | Connection URI for MongoDB cluster | Task 7+ |
| `MICROSOFT_CLIENT_ID` | Entra ID App Client ID | Task 9+ |
| `MICROSOFT_CLIENT_SECRET` | Entra ID Client Secret | Task 9+ |
| `MICROSOFT_TENANT_ID` | Entra ID Tenant ID | Task 9+ |
| `MICROSOFT_REDIRECT_URI` | Entra ID OAuth Redirect URI | Task 9+ |
| `MICROSOFT_POST_LOGOUT_REDIRECT_URI`| Entra ID Post-Logout Redirect URI | Task 9+ |
| `SESSION_SECRET` | Secret key used for cryptographic session cookies | Task 9+ |

> ⚠️ **Security Notice**: Never commit `.env` files, production tokens, client secrets, or credentials to version control.

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Install All Dependencies
Install dependencies concurrently across the root, frontend, and backend packages:

```bash
npm run install:all
```

Or install individually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

---

## 💻 Development Commands

The root `package.json` provides unified scripts to control both backend and frontend applications:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts **both** Frontend (`localhost:3000`) and Backend (`localhost:5000`) concurrently |
| `npm run dev:frontend` | Starts only the Vite React frontend development server |
| `npm run dev:backend` | Starts only the Express TypeScript backend development server with hot-reload |
| `npm run lint` | Executes ESLint across both frontend and backend codebases |
| `npm run typecheck` | Executes `tsc --noEmit` across both codebases in TypeScript strict mode |
| `npm test` | Runs all unit and integration test suites via Vitest |
| `npm run test:e2e` | Runs Playwright end-to-end test suite |
| `npm run build` | Builds both frontend and backend for production deployment |

---

## 🏥 Health Check Endpoint

To verify backend server health:
- **Endpoint**: `GET /api/v1/health`
- **Sample Response**:
```json
{
  "success": true,
  "status": "healthy",
  "service": "WFA API",
  "timestamp": "2026-09-02T11:30:00.000Z",
  "uptime": 12.34
}
```

---

## 📊 Current Task Status (Day 1 & Day 2)

- [x] **Task 1: Project Setup & Monorepo Foundation**
  - Git repository initialized with `main`, `develop`, and `feature/sagar-day1-day2-foundation` branches.
  - Root configuration, scripts, `.gitignore`, `.env.example`, `LICENSE`, and `README.md`.
  - Frontend React 18 + Vite + TypeScript strict mode + centralized Axios client.
  - Backend Express + TypeScript + Zod validation + Helmet + CORS + `/api/v1/health`.
  - Global application feedback states & React Error Boundary.
- [x] **Task 2: Architecture & Design System**
  - Complete architecture documentation in `docs/architecture/`.
  - Microsoft Entra ID authentication flow architecture defined.
  - Centralized RBAC model (Admin, HR, Manager, Team Lead, Employee).
  - Design tokens, Light & Dark themes, and responsive theme switcher.
  - Accessible, WCAG-compliant reusable component library.
- [x] **Task 3: Enterprise Layout**
  - Responsive App Shell (Collapsible Sidebar, Header, Breadcrumbs, User Profile).
  - Feedback screens (403 Forbidden, 404 Not Found, 500 Server Error, Network Error).
- [x] **Task 4: Routes & Navigation**
  - Centralized route registry with RBAC metadata and route guards.
  - Role dashboard page shells (`/admin/dashboard`, `/hr/dashboard`, `/manager/dashboard`, etc.).
  - Core module page shells (Employees, Attendance, Absence, Scheduling, Analytics, Compliance, Payroll, Reports, Settings).
- [x] **Testing & Verification**
  - Vitest test suites configured and passing.
  - `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passing cleanly.

---

## 🔒 Security & RBAC Principles

1. **Passwordless & SSO First**: No local passwords or credentials collection. Authentication relies exclusively on Microsoft Entra ID with MFA and Conditional Access policies.
2. **Secure Session Handling**: No sensitive tokens stored in `localStorage`.
3. **Defense in Depth**: Frontend route guards enhance user experience, while backend API middleware acts as the strict enforcement point.
