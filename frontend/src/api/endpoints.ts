export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    MICROSOFT_LOGIN: '/auth/microsoft/login',
    MICROSOFT_CALLBACK: '/auth/microsoft/callback',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  EMPLOYEES: {
    LIST: '/employees',
    DETAIL: (id: string) => `/employees/${id}`,
  },
  ATTENDANCE: {
    LIST: '/attendance',
    CLOCK: '/attendance/clock',
    HISTORY: '/attendance/history',
    CORRECTIONS: '/attendance/corrections',
  },
  ABSENCE: {
    LIST: '/absence',
    REQUEST: '/absence/request',
  },
  SCHEDULING: {
    SHIFTS: '/scheduling/shifts',
    SWAPS: '/scheduling/swaps',
  },
  ANALYTICS: {
    SUMMARY: '/analytics/summary',
  },
  COMPLIANCE: {
    AUDIT: '/compliance/audit',
  },
  PAYROLL: {
    SUMMARY: '/payroll/summary',
  },
} as const;
