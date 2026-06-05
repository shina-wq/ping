import { apiClient } from "@/api/client";

// Types

export type AssignmentStatus =
  | "upcoming"
  | "due_soon"
  | "due_tomorrow"
  | "overdue"
  | "submitted"
  | "graded";

export type Assignment = {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string; // ISO 8601 date string
  status: AssignmentStatus;
};

export type SubmitAssignmentPayload = {
  content?: string;
  fileUrl?: string;
};

// Requests

export async function getAssignments(): Promise<Assignment[]> {
  const { data } = await apiClient.get<Assignment[]>("/assignments");
  return data;
}

export async function getAssignment(id: string): Promise<Assignment> {
  const { data } = await apiClient.get<Assignment>(`/assignments/${id}`);
  return data;
}

export async function submitAssignment(
  id: string,
  payload: SubmitAssignmentPayload
): Promise<void> {
  await apiClient.post(`/assignments/${id}/submit`, payload);
}