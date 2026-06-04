import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL && import.meta.env.DEV) {
  console.warn("[api] VITE_API_URL is not set — requests will use a relative base URL.");
}

export const apiClient = axios.create({
  baseURL: baseURL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralize API error mapping (toasts, 401 redirect) when auth is wired.
    return Promise.reject(error);
  }
);
