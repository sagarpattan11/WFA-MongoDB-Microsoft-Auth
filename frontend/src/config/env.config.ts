export interface FrontendEnvConfig {
  apiUrl: string;
  socketUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  version: string;
}

export const env: FrontendEnvConfig = {
  apiUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/v1',
  socketUrl: (import.meta.env.VITE_SOCKET_URL as string) || 'http://localhost:5000',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  version: '1.0.0-dev',
};
