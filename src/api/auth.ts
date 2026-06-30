import { apiClient } from "@/api/client";

// Types

export type UserRole = "student" | "teacher" | "admin";

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  studentId?: string;
  yearOfStudy?: string;
  createdAt?: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
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
  setToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    "/auth/forgot-password",
    payload
  );
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await apiClient.post("/auth/reset-password", payload);
}

/**
 * Session is resolved via GET /v1/users/me (the docs have no dedicated
 * /auth/session route). Returns null when there's no stored token so
 * callers can treat "no session" and "logged out" identically.
 */
export async function getSession(): Promise<AuthUser | null> {
  const token = getToken();

  if (!token) return null;

  const { data } = await apiClient.get<AuthUser>("/users/me");

  return data;
}