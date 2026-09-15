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
    USERS: '/auth/users',
    UPDATE_ROLE: (id: string) => `/auth/users/${id}/role`,
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
    IMPORT: '/employees/import',
    EXPORT: '/employees/export',
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

  // Locations & Roles
  LOCATIONS: {
    LIST: '/locations',
  },
  ROLES: {
    LIST: '/roles',
  },

  // Skill Analytics & Recommendations
  SKILLS: {
    LIST: '/skills',
    OVERVIEW: '/skills/analytics/overview',
    GAPS: '/skills/analytics/gaps',
    RECOMMENDATIONS: '/skills/analytics/recommendations',
  },

  // Dashboard Telemetry & Charts
  DASHBOARD: {
    KPIS: '/dashboard/kpis',
    CHARTS: '/dashboard/charts',
  },

  // Sprint 2: Placement Analytics
  PLACEMENT: {
    SUMMARY: '/placement/analytics/summary',
    FUNNEL: '/placement/analytics/funnel',
    BREAKDOWN: '/placement/analytics/breakdown',
    CANDIDATES: '/placement/candidates',
  },

  // Sprint 2: Recruitment Analytics
  RECRUITMENT: {
    SUMMARY: '/recruitment/analytics/summary',
    FUNNEL: '/recruitment/analytics/funnel',
    BREAKDOWN: '/recruitment/analytics/breakdown',
    REQUISITIONS: '/recruitment/requisitions',
    APPLICATIONS: '/recruitment/applications',
  },

  // Sprint 2: Learning & Upskilling Analytics
  LEARNING: {
    SUMMARY: '/learning/analytics/summary',
    SKILL_IMPACT: '/learning/analytics/skill-impact',
    ENROLLMENTS: '/learning/enrollments',
  },

  // Sprint 2: Reporting & Exports
  REPORTS: {
    EXPORT: '/reports/export',
  },

  // Sprint 3: Attrition Prediction & Flight Risk
  ATTRITION: {
    SUMMARY: '/attrition/summary',
    RISK_MATRIX: '/attrition/risk-matrix',
    DRIVERS: '/attrition/drivers',
    EMPLOYEES: '/attrition/employees',
    MODEL_METRICS: '/attrition/model-metrics',
    UPDATE_STATUS: (id: string) => `/attrition/employees/${id}/status`,
  },

  // Sprint 3: Workforce Demand Forecasting & Scenario Simulator
  FORECASTING: {
    SUMMARY: '/forecasting/summary',
    PROJECTIONS: '/forecasting/projections',
    SKILL_DEMAND: '/forecasting/skill-demand',
    FORECASTS: '/forecasting/forecasts',
    SIMULATE: '/forecasting/simulate',
  },

  // Sprint 3: Executive Cockpit & Real-time Alerts
  EXECUTIVE: {
    OVERVIEW: '/executive/overview',
    ALERTS: '/executive/alerts',
    MARK_READ: (id: string) => `/executive/alerts/${id}/read`,
    RESOLVE: (id: string) => `/executive/alerts/${id}/resolve`,
    READ_ALL: '/executive/alerts/read-all',
  },

  // Sprint 3: Performance & Productivity Analytics
  PERFORMANCE: {
    SUMMARY: '/performance/summary',
    TRENDS: '/performance/trends',
    REVIEWS: '/performance/reviews',
  },

  // Sprint 3: Audit & Compliance Trail
  AUDIT: {
    LIST: '/audit-logs',
  },
} as const;
