import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

// Types
export type AssignmentStatus =
  | "upcoming"
  | "due_soon"
  | "due_tomorrow"
  | "overdue"
  | "submitted"
  | "graded";

export type SubmissionType = "file_upload" | "text" | "link";

export type RubricCriterion = {
  criterion: string;
  points: number;
};

export type Assignment = {
  id: string;
  courseId: string;
  courseName: string;
  instructor?: string;
  title: string;
  description?: string;
  dueDate: string;
  status: AssignmentStatus;
  points: number;
  submissionType: SubmissionType;
  gradingRubric?: RubricCriterion[];
  reminderNote?: string;
};

export type ListAssignmentsParams = PaginationParams & {
  status?: AssignmentStatus;
  courseId?: string;
};

export type CreateAssignmentInput = {
  title: string;
  description?: string;
  dueDate: string; // ISO 8601
  points: number;
  submissionType: SubmissionType;
  gradingRubric?: RubricCriterion[];
};

export type UpdateAssignmentInput = Partial<CreateAssignmentInput>;

export type SubmitAssignmentPayload = {
  fileUrl?: string;
  content?: string;
};

// Queries

/** All assignments across the user's courses - for the global Assignments page. */
export const getAssignments = async (
  params: ListAssignmentsParams = {}
): Promise<Paginated<Assignment>> => {
  const { data } = await apiClient.get<Paginated<Assignment>>("/assignments", { params });
  return data;
};

/** Assignments scoped to a single course. */
export const getCourseAssignments = async (
  courseId: string,
  params: ListAssignmentsParams = {}
): Promise<Paginated<Assignment>> => {
  const { data } = await apiClient.get<Paginated<Assignment>>(
    `/courses/${courseId}/assignments`,
    { params }
  );
  return data;
};

export const getAssignment = async (id: string): Promise<Assignment> => {
  const { data } = await apiClient.get<Assignment>(`/assignments/${id}`);
  return data;
};

// Mutations

export const addAssignment = async (
  courseId: string,
  input: CreateAssignmentInput
): Promise<Assignment> => {
  const { data } = await apiClient.post<Assignment>(
    `/courses/${courseId}/assignments`,
    input
  );
  return data;
};

export const updateAssignment = async (
  id: string,
  input: UpdateAssignmentInput
): Promise<Assignment> => {
  const { data } = await apiClient.patch<Assignment>(`/assignments/${id}`, input);
  return data;
};

export const deleteAssignment = async (id: string): Promise<void> => {
  await apiClient.delete(`/assignments/${id}`);
};

export const submitAssignment = async (
  id: string,
  payload: SubmitAssignmentPayload
): Promise<void> => {
  await apiClient.post(`/assignments/${id}/submissions`, payload);
};