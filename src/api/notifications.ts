import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

// Types
export type Notification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO 8601 date string
};

export type ListNotificationsParams = PaginationParams & {
  isRead?: boolean;
};

// Requests
export async function getNotifications(
  params: ListNotificationsParams = {}
): Promise<Paginated<Notification>> {
  const { data } = await apiClient.get<Paginated<Notification>>("/notifications", { params });
  return data;
}

/** Returns the count of unread notifications. */
export async function getNotificationCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>("/notifications/count");
  return data.count;
}

export async function markNotificationRead(id: string, isRead = true): Promise<void> {
  await apiClient.patch(`/notifications/${id}`, { isRead });
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  const { data } = await apiClient.post<{ updated: number }>("/notifications/read-all");
  return data;
}

export async function dismissNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}

export async function dismissAllNotifications(): Promise<void> {
  await apiClient.delete("/notifications");
}