import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '../config';
import type { ApiError } from '../types';

/**
 * A single, shared axios instance for the whole app.
 * Centralizing this lets us configure timeout, base URL, and
 * auth-token injection in exactly one place.
 */
const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Holds the current auth token in memory so the interceptor can inject it.
let authToken: string | null = null;

/** Update the token used for the Authorization header (called after login/logout). */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

// Request interceptor: attach the JWT-style token if we have one.
client.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  if (authToken) {
    cfg.headers.Authorization = `Bearer ${authToken}`;
  }
  return cfg;
});

/**
 * Normalize errors into a consistent shape so the UI can show the right message.
 * We distinguish: network failure, timeout, and server (4xx/5xx) errors.
 */
function normalizeError(error: unknown): ApiError {
  if (axios.isCancel(error)) {
    return { type: 'cancel', message: 'Request cancelled.' };
  }

  const axiosError = error as AxiosError<{ message?: string; error?: string }>;

  if (axiosError.code === 'ECONNABORTED') {
    return { type: 'timeout', message: 'The request timed out. Please try again.' };
  }

  if (!axiosError.response) {
    // No response object means we never reached the server.
    return {
      type: 'network',
      message: 'Network error. Check your connection and that the backend is running.',
    };
  }

  const status = axiosError.response.status;
  const data = axiosError.response.data;
  const serverMsg = data && (data.message || data.error);
  return {
    type: 'server',
    status,
    message: serverMsg || `Server responded with status ${status}.`,
  };
}

// Response interceptor: pass success through, normalize failures.
client.interceptors.response.use(
  (res) => res,
  (error: unknown) => Promise.reject(normalizeError(error))
);

export default client;
