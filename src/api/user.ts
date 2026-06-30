import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";
import type { AuthUser, ChangePasswordPayload, UserRole } from "@/api/auth";

// Types

export type UpdateMePayload = {
  name?: string;
  avatarUrl?: string;
};

export type ListUsersParams = PaginationParams & {
  role?: UserRole;
  search?: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  role?: UserRole;
  yearOfStudy?: string;
};

// Self-service (Authenticated)

export const getMe = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get<AuthUser>("/users/me");
  return data;
};

export const updateMe = async (input: UpdateMePayload): Promise<AuthUser> => {
  const { data } = await apiClient.patch<AuthUser>("/users/me", input);
  return data;
};

export const changeMyPassword = async (input: ChangePasswordPayload): Promise<void> => {
  await apiClient.patch("/users/me/password", input);
};

// Admin

export const getUsers = async (params: ListUsersParams = {}): Promise<Paginated<AuthUser>> => {
  const { data } = await apiClient.get<Paginated<AuthUser>>("/users", { params });
  return data;
};

export const createUser = async (input: CreateUserInput): Promise<AuthUser> => {
  const { data } = await apiClient.post<AuthUser>("/users", input);
  return data;
};

export const getUser = async (userId: string): Promise<AuthUser> => {
  const { data } = await apiClient.get<AuthUser>(`/users/${userId}`);
  return data;
};

export const updateUser = async (userId: string, input: UpdateUserInput): Promise<AuthUser> => {
  const { data } = await apiClient.patch<AuthUser>(`/users/${userId}`, input);
  return data;
};

export const deactivateUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};