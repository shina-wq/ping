import { apiClient } from "@/api/client";

// Types

export type Reminder = {
  id: string;
  title: string;
  detail: string;    // e.g. "Mathematics 101 · Dec 14 at 11:59 PM"
  dueDate: string;   // ISO 8601 date string
  isUrgent: boolean; // true = due within 24h, drives the highlighted style
};

// Requests

export async function getReminders(): Promise<Reminder[]> {
  const { data } = await apiClient.get<Reminder[]>("/reminders");
  return data;
}

export async function dismissReminder(id: string): Promise<void> {
  await apiClient.delete(`/reminders/${id}`);
}