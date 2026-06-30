import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

export type SubmissionStatus = "submitted" | "returned" | "graded";

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  fileUrl?: string;
  content?: string;
  status: SubmissionStatus;
  submittedAt: string;
  grade?: number | null;
};

export type UpdateSubmissionInput = {
  status: SubmissionStatus;
  feedback?: string;
};

export const getSubmissions = async (
  assignmentId: string,
  params: PaginationParams = {}
): Promise<Paginated<Submission>> => {
  const { data } = await apiClient.get<Paginated<Submission>>(
    `/assignments/${assignmentId}/submissions`,
    { params }
  );
  return data;
};

export const getSubmission = async (
  assignmentId: string,
  submissionId: string
): Promise<Submission> => {
  const { data } = await apiClient.get<Submission>(
    `/assignments/${assignmentId}/submissions/${submissionId}`
  );
  return data;
};

export const updateSubmission = async (
  assignmentId: string,
  submissionId: string,
  input: UpdateSubmissionInput
): Promise<Submission> => {
  const { data } = await apiClient.patch<Submission>(
    `/assignments/${assignmentId}/submissions/${submissionId}`,
    input
  );
  return data;
};