import { apiClient } from "@/api/client";

// Types
export type AssignmentStatus =
  | "upcoming"
  | "submitted"
  | "graded";

export type RubricCriterion = {
  criterion: string;
  points: number;
}

export type Assignment = {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  instructor: string;        // ADD to backend
  dueDate: string;
  status: AssignmentStatus;
  points: number;            // ADD to backend
  submissionType: string;    // e.g. "File upload" - ADD to backend
  description?: string;      // ADD to backend
  gradingRubric?: RubricCriterion[]; // ADD to backend
  reminderNote?: string; 
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

// Queries
export const getAssignments = async (): Promise<Assignment[]> => {
  const { data } = await apiClient.get<Assignment[]>("/assignments");
  return data;
};

export const getAssignment = async (id: string): Promise<Assignment> => {
  const { data } = await apiClient.get<Assignment>(`/assignments/${id}`);
  return data;
};

// Mutations
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