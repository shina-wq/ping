import axios from "axios";
import { toApiError } from "@/lib/api-error";

// Defined locally rather than importing from auth.ts to avoid a circular
// dependency (auth.ts imports apiClient from this module).
const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// All routes are versioned under /v1 per the API reference.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/v1`
  : "/v1";

if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
  console.warn(
    "[api] VITE_API_URL is not set — requests will use a relative base URL."
  );
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT setup (not cookies)
});

// Request Interceptor
// Automatically attach JWT token to every request if it exists

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);

    // If token is invalid or expired -> force logout flow
    if (apiError.isUnauthorized) {
      localStorage.removeItem("auth_token");
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(apiError);
  }
);