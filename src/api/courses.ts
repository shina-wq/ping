import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

// TYPES
export type CourseStatus = "active" | "completed" | "archived";

export type Course = {
  id: string;
  title: string;
  instructor?: string;
  instructorId?: string;
  progress: number; // 0–100
  taskCount: number;
  status: CourseStatus;
  term?: string;
  year?: number;
  enrolledCount?: number;
};

export type ListCoursesParams = PaginationParams & {
  search?: string;
  status?: CourseStatus;
};

export type CreateCourseInput = {
  title: string;
  term?: string;
  year?: number;
  status?: CourseStatus;
};

export type UpdateCourseInput = Partial<CreateCourseInput>;

export type EnrolledStudent = {
  id: string;
  name: string;
  email: string;
  progress: number;
  enrolledAt: string;
};

// QUERIES
export const getCourses = async (params: ListCoursesParams = {}): Promise<Paginated<Course>> => {
  const { data } = await apiClient.get<Paginated<Course>>("/courses", { params });
  return data;
};

export const getCourse = async (id: string): Promise<Course> => {
  const { data } = await apiClient.get<Course>(`/courses/${id}`);
  return data;
};

export const getCourseStudents = async (
  courseId: string,
  params: PaginationParams = {}
): Promise<Paginated<EnrolledStudent>> => {
  const { data } = await apiClient.get<Paginated<EnrolledStudent>>(
    `/courses/${courseId}/students`,
    { params }
  );
  return data;
};

// MUTATIONS
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

export const enrollStudent = async (courseId: string, studentId: string): Promise<void> => {
  await apiClient.post(`/courses/${courseId}/enroll`, { studentId });
};

export const removeStudent = async (courseId: string, studentId: string): Promise<void> => {
  await apiClient.delete(`/courses/${courseId}/students/${studentId}`);
};