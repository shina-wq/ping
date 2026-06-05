import { apiClient } from "@/api/client";

// Types

export type Notification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO 8601 date string
};

// Requests

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>("/notifications");
  return data;
}

/** Returns the count of unread notifications. */
export async function getNotificationCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>("/notifications/count");
  return data.count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}