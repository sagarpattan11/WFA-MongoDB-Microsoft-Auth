# Microsoft Entra ID Authentication Flow Specification

## 1. Overview & Zero-Trust Principles

The Workforce Analytics Platform relies strictly on **Microsoft Entra ID** (formerly Azure Active Directory) for enterprise identity and access management. 

### Core Security Mandates:
- **No Local Password Collection**: The application provides no password input forms and stores zero user passwords.
- **Passwordless & MFA Controlled by Microsoft**: All authentication factors (Windows Hello, FIDO2 Passkeys, Microsoft Authenticator, MFA push) are enforced directly within Entra ID.
- **No Tokens in LocalStorage**: Access tokens and refresh tokens are strictly held in secure, encrypted HTTP-only session cookies and backend memory; never in browser `localStorage` or `sessionStorage`.
- **Zero Mock Authentication**: No fake login states or simulated identities. The initial implementation provides the configuration-guarded Entra ID sign-in entry shell.

---

## 2. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Enterprise User
    participant Browser as React Frontend
    participant Backend as Express API Server
    participant Entra as Microsoft Entra ID
    participant DB as MongoDB Persistence

    User->>Browser: Clicks "Sign in with Microsoft"
    Browser->>Backend: GET /api/v1/auth/microsoft/login
    Note over Backend: Generates PKCE code_verifier, code_challenge, state & nonce
    Backend-->>Browser: 302 Redirect to Microsoft Authorization URL
    Browser->>Entra: Navigates to login.microsoftonline.com
    Note over Entra,User: User completes SSO, MFA, Authenticator, or Passkey prompt
    Entra-->>Browser: 302 Redirect to /auth/callback?code=...&state=...
    Browser->>Backend: POST /api/v1/auth/microsoft/callback (code, state)
    Note over Backend: Validates state & PKCE verifier against session
    Backend->>Entra: POST /oauth2/v2.0/token (Exchange auth code for tokens)
    Entra-->>Backend: Returns id_token, access_token
    Note over Backend: Validates id_token signature, claims, tenant, & allowed email domain
    Backend->>DB: Find or provision user account & sync RBAC roles
    DB-->>Backend: User profile record
    Note over Backend: Creates encrypted session cookie (HttpOnly, Secure, SameSite=Lax)
    Backend-->>Browser: 200 OK + Set-Cookie: wfa_session=... + User Profile
    Browser->>Browser: Update Auth Redux State & navigate to Role Dashboard
```

---

## 3. Configuration & Fallback States

When Microsoft Entra ID environment variables are not yet populated in `.env`:
- The frontend displays a clean, disabled SSO button shell indicating **"Microsoft Entra ID configuration pending"**.
- Direct API calls to auth endpoints return a descriptive JSON error explaining missing credentials.
- Zero local password fallback is allowed.
