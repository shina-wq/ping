import { apiClient } from "@/api/client";

// -------------------------
// TYPES
// -------------------------

export type Grade = {
  id: string;
  title: string;      // assessment name e.g. "Midterm Exam"
  courseId: string;
  courseName: string;
  score: number;      // points earned
  maxScore: number;   // total possible points
  gradedAt: string;   // ISO 8601
};

export type CreateGradeInput = {
  courseId: string;
  assignmentId?: string;
  title: string;
  score: number;
  maxScore: number;
  gradedAt?: string;  // ISO 8601 — defaults to now if omitted
};

// -------------------------
// QUERIES
// -------------------------

export const getGrades = async (): Promise<Grade[]> => {
  const { data } = await apiClient.get<Grade[]>("/grades");
  return data;
};

export const getGrade = async (id: string): Promise<Grade> => {
  const { data } = await apiClient.get<Grade>(`/grades/${id}`);
  return data;
};

// -------------------------
// MUTATIONS
// -------------------------

export const createGrade = async (input: CreateGradeInput): Promise<Grade> => {
  const { data } = await apiClient.post<Grade>("/grades", input);
  return data;
};