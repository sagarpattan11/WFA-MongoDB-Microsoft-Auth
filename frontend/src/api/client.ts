import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env.config';

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface StandardApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: env.apiUrl,
    timeout: 15000, // 15 seconds timeout
    withCredentials: true, // Secure HttpOnly session cookies
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request Interceptor: Attach trace headers or request metadata
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Trace request ID
      config.headers.set('X-Client-Timestamp', new Date().toISOString());
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(new ApiClientError(error.message, 'REQUEST_SETUP_ERROR'));
    }
  );

  // Response Interceptor: Uniform error handling & 401 hooks
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError<StandardApiError>) => {
      // 1. Network / Offline Error
      if (!error.response) {
        return Promise.reject(
          new ApiClientError(
            'Unable to reach server. Please check your internet connection.',
            'NETWORK_ERROR'
          )
        );
      }

      const { status, data } = error.response;

      // 2. 401 Unauthorized Hook (Secure session expired or invalid)
      if (status === 401) {
        // Dispatch custom session-expired event or hook
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wfa:session-expired'));
        }
        return Promise.reject(
          new ApiClientError(
            data?.error?.message || 'Session expired or invalid. Please sign in again.',
            data?.error?.code || 'UNAUTHORIZED',
            401
          )
        );
      }

      // 3. 403 Forbidden Hook
      if (status === 403) {
        return Promise.reject(
          new ApiClientError(
            data?.error?.message || 'Access denied. You do not have permission for this action.',
            data?.error?.code || 'FORBIDDEN',
            403
          )
        );
      }

      // 4. Other standardized API errors
      return Promise.reject(
        new ApiClientError(
          data?.error?.message || error.message || 'An unexpected server error occurred.',
          data?.error?.code || 'API_ERROR',
          status,
          data?.error?.details
        )
      );
    }
  );

  return instance;
};

export const apiClient = createApiClient();

// Strongly typed HTTP helper wrappers
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<StandardApiResponse<T>>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<StandardApiResponse<T>>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<StandardApiResponse<T>>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<StandardApiResponse<T>>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<StandardApiResponse<T>>(url, config).then((res) => res.data),
};
