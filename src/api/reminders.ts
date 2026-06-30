import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

// Types
export type Reminder = {
  id: string;
  title: string;
  detail: string;    // e.g. "Mathematics 101 · Dec 14 at 11:59 PM"
  dueDate: string;   // ISO 8601 date string
  isUrgent: boolean; // true = due within 24h, drives the highlighted style
};

export type CreateReminderInput = {
  title: string;
  detail: string;
  dueDate: string; // ISO 8601
};

// Requests
export async function getReminders(
  params: PaginationParams = {}
): Promise<Paginated<Reminder>> {
  const { data } = await apiClient.get<Paginated<Reminder>>("/reminders", { params });
  return data;
}

export async function createReminder(input: CreateReminderInput): Promise<Reminder> {
  const { data } = await apiClient.post<Reminder>("/reminders", input);
  return data;
}

export async function dismissReminder(id: string): Promise<void> {
  await apiClient.delete(`/reminders/${id}`);
}

export async function dismissAllReminders(): Promise<void> {
  await apiClient.delete("/reminders");
}