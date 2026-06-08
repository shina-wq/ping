import { apiClient } from "@/api/client";

// -------------------------
// TYPES
// -------------------------

export type Course = {
  id: string;
  title: string;
  instructor?: string;
  taskCount: number;
  progress: number; // 0–100
};

export type CreateCourseInput = {
  title: string;
  instructor?: string;
  term?: string;
  year?: number;
  progress?: number;
  status?: "active" | "completed";
};

export type UpdateCourseInput = Partial<CreateCourseInput>;

// -------------------------
// QUERIES
// -------------------------

export const getCourses = async (): Promise<Course[]> => {
  const { data } = await apiClient.get<Course[]>("/courses");
  return data;
};

export const getCourse = async (id: string): Promise<Course> => {
  const { data } = await apiClient.get<Course>(`/courses/${id}`);
  return data;
};

// -------------------------
// MUTATIONS
// -------------------------

export const addCourse = async (input: CreateCourseInput): Promise<Course> => {
  const { data } = await apiClient.post<Course>("/courses", input);
  return data;
};

export const updateCourse = async (id: string, input: UpdateCourseInput): Promise<Course> => {
  const { data } = await apiClient.patch<Course>(`/courses/${id}`, input);
  return data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await apiClient.delete(`/courses/${id}`);
};