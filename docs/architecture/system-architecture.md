# System Architecture Specification

## 1. Overview

The **Workforce Analytics Platform (WFA)** is a multi-tier enterprise web application architected for resilience, security, role-based governance, and real-time operational telemetries.

```mermaid
graph TD
    User([Enterprise User / Browser])
    
    subgraph ClientTier [Frontend Application - React + Vite]
        AppShell[Enterprise App Shell]
        AuthGuard[Client Auth & RBAC Guards]
        StateStore[Redux Toolkit & React Query]
        DesignSystem[Design System & MUI Theme Engine]
        AxiosClient[Centralized API Client]
        SocketClient[Socket.IO Client]
    end

    subgraph IdentityProvider [Identity & Access Management]
        EntraID[Microsoft Entra ID / Azure AD]
    end

    subgraph ServerTier [Backend Application - Node.js + Express]
        Gateway[Security Middlewares Helmet, CORS, RateLimiter]
        AuthEngine[Microsoft Token Validation & Session Handler]
        RBACMiddleware[Role & Permission Authorization Engine]
        APIControllers[Domain Controllers & Services]
        SocketEngine[Socket.IO Realtime Server]
    end

    subgraph DataTier [Persistence & Audit Storage - Future Task 7+]
        MongoCluster[(MongoDB Atlas / Enterprise Cluster)]
    end

    User -->|HTTPS| AppShell
    AppShell --> AuthGuard
    AuthGuard -->|OIDC / OAuth 2.0 PKCE| EntraID
    AppShell --> AxiosClient
    AppShell --> SocketClient
    
    AxiosClient -->|REST API Requests / Encrypted Cookies| Gateway
    Gateway --> AuthEngine
    AuthEngine --> RBACMiddleware
    RBACMiddleware --> APIControllers
    
    SocketClient -->|WSS Realtime Connection| SocketEngine
    
    APIControllers -.->|Mongoose ODM| MongoCluster
```

---

## 2. Architectural Pillars

1. **Defense in Depth**:
   - Client-side navigation guards provide user experience routing.
   - Backend Express middlewares enforce strict identity validation, role verification, and permission validation on every API endpoint.
2. **Zero-Trust Identity**:
   - Zero password collection or storage within the application.
   - Microsoft Entra ID manages passwordless authentication, multi-factor authentication (MFA), and conditional access policies.
3. **Decoupled Monorepo Structure**:
   - Frontend and Backend projects operate independently with typed API contracts, shared schema validations via Zod, and clear folder boundaries.
4. **Resilient Feedback & Fault Tolerance**:
   - Centralized React Error Boundaries prevent blank screen lockups.
   - Global HTTP interceptors manage retry flows, 401 unauthenticated handoffs, 403 access rejections, and offline handling.
5. **Real-time Event Streaming**:
   - Socket.IO manages bi-directional telemetry for live shift rosters, attendance check-ins, and compliance alerts.

---

## 3. Communication Protocols

| Channel | Protocol | Security Mechanism | Purpose |
| :--- | :--- | :--- | :--- |
| **REST APIs** | HTTPS / JSON | HttpOnly, Secure, SameSite cookies / Bearer headers | Transactional data CRUD, reporting, analytics |
| **Identity & SSO** | HTTPS / OIDC PKCE | Cryptographic state & nonce, Microsoft Entra ID | User login, token exchange, SSO |
| **Realtime Telemetry**| WSS (WebSocket) | Handshake session cookie validation | Live rosters, audit logs, alerts |
