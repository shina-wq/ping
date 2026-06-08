import { apiClient } from "@/api/client";

// -------------------------
// TYPES
// -------------------------

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
  dueDate: string; // ISO 8601
  status: AssignmentStatus;
};

export type CreateAssignmentInput = {
  courseId: string;
  title: string;
  description?: string;
  dueDate: string; // ISO 8601
};

export type UpdateAssignmentInput = {
  title?: string;
  description?: string;
  dueDate?: string;
};

export type SubmitAssignmentPayload = {
  content?: string;
  fileUrl?: string;
};

// -------------------------
// QUERIES
// -------------------------

export const getAssignments = async (): Promise<Assignment[]> => {
  const { data } = await apiClient.get<Assignment[]>("/assignments");
  return data;
};

export const getAssignment = async (id: string): Promise<Assignment> => {
  const { data } = await apiClient.get<Assignment>(`/assignments/${id}`);
  return data;
};

// -------------------------
// MUTATIONS
// -------------------------

export const addAssignment = async (
  input: CreateAssignmentInput
): Promise<Assignment> => {
  const { data } = await apiClient.post<Assignment>("/assignments", input);
  return data;
};

export const updateAssignment = async (
  id: string,
  input: UpdateAssignmentInput
): Promise<Assignment> => {
  const { data } = await apiClient.patch<Assignment>(
    `/assignments/${id}`,
    input
  );
  return data;
};

export const submitAssignment = async (
  id: string,
  payload: SubmitAssignmentPayload
): Promise<void> => {
  await apiClient.post(`/assignments/${id}/submit`, payload);
};

export const deleteAssignment = async (id: string): Promise<void> => {
  await apiClient.delete(`/assignments/${id}`);
};