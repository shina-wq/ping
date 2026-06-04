import { apiClient } from "@/api/client";

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

export type LoginResponse = {
  user: AuthUser;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getSession(): Promise<AuthUser | null> {
  const { data } = await apiClient.get<AuthUser | null>("/auth/session");
  return data;
}
