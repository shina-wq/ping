import axios from "axios";

import { toApiError } from "@/lib/api-error";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL && import.meta.env.DEV) {
  console.warn(
    "[api] VITE_API_URL is not set — requests will use a relative base URL."
  );
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
    const apiError = toApiError(error);

    if (apiError.isUnauthorized) {
      // Dispatch a custom event so AuthContext can react without a circular import.
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(apiError);
  }
);
