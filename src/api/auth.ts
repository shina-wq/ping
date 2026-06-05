import { apiClient } from "@/api/client";

// Types

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

// Token helpers

const TOKEN_KEY = "auth_token";

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// API Calls

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);

  // Persist token immediately
  setToken(data.token);

  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    clearToken();
  }
}

export async function getSession(): Promise<AuthUser | null> {
  const token = getToken();

  if (!token) return null;

  const { data } = await apiClient.get<AuthUser>("/auth/session", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}