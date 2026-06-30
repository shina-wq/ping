import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

// TYPES
export type Grade = {
  id: string;
  courseId: string;
  courseName: string;
  assignmentId: string;
  studentId: string;
  title: string;      // assessment name e.g. "Midterm Exam"
  score: number;       // points earned
  maxScore: number;    // total possible points
  feedback?: string;
  gradedAt: string;    // ISO 8601
};

export type ListGradesParams = PaginationParams & {
  courseId?: string;
};

export type CreateGradeInput = {
  courseId: string;
  assignmentId: string;
  studentId: string;
  title: string;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedAt?: string;  // ISO 8601 - defaults to now if omitted
};

export type UpdateGradeInput = {
  score?: number;
  feedback?: string;
};

// QUERIES
export const getGrades = async (params: ListGradesParams = {}): Promise<Paginated<Grade>> => {
  const { data } = await apiClient.get<Paginated<Grade>>("/grades", { params });
  return data;
};

export const getGrade = async (id: string): Promise<Grade> => {
  const { data } = await apiClient.get<Grade>(`/grades/${id}`);
  return data;
};

// MUTATIONS
export const createGrade = async (input: CreateGradeInput): Promise<Grade> => {
  const { data } = await apiClient.post<Grade>("/grades", input);
  return data;
};

export const updateGrade = async (id: string, input: UpdateGradeInput): Promise<Grade> => {
  const { data } = await apiClient.patch<Grade>(`/grades/${id}`, input);
  return data;
};

export const deleteGrade = async (id: string): Promise<void> => {
  await apiClient.delete(`/grades/${id}`);
};