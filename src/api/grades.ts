import { apiClient } from "@/api/client";

// Types

export type Grade = {
  id: string;
  title: string;       // assessment name, e.g. "Midterm Exam"
  courseId: string;
  courseName: string;
  score: number;       // points earned
  maxScore: number;    // total possible points
  gradedAt: string;    // ISO 8601 date string
};

// Requests

export async function getGrades(): Promise<Grade[]> {
  const { data } = await apiClient.get<Grade[]>("/grades");
  return data;
}

export async function getGrade(id: string): Promise<Grade> {
  const { data } = await apiClient.get<Grade>(`/grades/${id}`);
  return data;
}