export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Authentication & WebAuthn / Passkeys
  AUTH: {
    REGISTER_CHALLENGE: '/auth/register-challenge',
    REGISTER_VERIFY: '/auth/register-verify',
    LOGIN_CHALLENGE: '/auth/login-challenge',
    LOGIN_VERIFY: '/auth/login-verify',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    CREDENTIALS: '/auth/credentials',
    RENAME_CREDENTIAL: (id: string) => `/auth/credentials/${id}`,
    REVOKE_CREDENTIAL: (id: string) => `/auth/credentials/${id}`,
  },

  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    DETAIL: (id: string) => `/employees/${id}`,
    CREATE: '/employees',
    UPDATE: (id: string) => `/employees/${id}`,
    UPDATE_STATUS: (id: string) => `/employees/${id}/status`,
    RESTORE: (id: string) => `/employees/${id}/restore`,
    DELETE: (id: string) => `/employees/${id}`,
  },

  // Departments & Teams
  DEPARTMENTS: {
    LIST: '/departments',
    CREATE: '/departments',
    UPDATE: (id: string) => `/departments/${id}`,
  },
  TEAMS: {
    LIST: '/teams',
    CREATE: '/teams',
  },

  // Dashboard Telemetry & Charts
  DASHBOARD: {
    KPIS: '/dashboard/kpis',
    CHARTS: '/dashboard/charts',
  },
} as const;
