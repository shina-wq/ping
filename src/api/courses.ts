import { apiClient } from "@/api/client";

// Types

export type Course = {
  id: string;
  title: string;
  instructor: string;
  taskCount: number;
  progress: number; // 0–100
};

// Requests

export async function getCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<Course[]>("/courses");
  return data;
}

export async function getCourse(id: string): Promise<Course> {
  const { data } = await apiClient.get<Course>(`/courses/${id}`);
  return data;
}