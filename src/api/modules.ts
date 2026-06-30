import { apiClient } from "@/api/client";
import type { Paginated, PaginationParams } from "@/api/pagination";

// Types
export type LessonType = "video" | "reading" | "quiz";
export type LessonStatus = "completed" | "current" | "locked";

export type CourseModule = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessonCount: number;
  completedCount: number;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  duration: string;
  status: LessonStatus;
  order: number;
  description: string;
  overview: string;
};

export type CreateModuleInput = {
  title: string;
  order: number;
};

export type UpdateModuleInput = Partial<CreateModuleInput>;

export type CreateLessonInput = {
  title: string;
  type: LessonType;
  duration: string;
  description: string;
  overview: string;
  order: number;
  videoUrl?: string;
};

export type UpdateLessonInput = Partial<CreateLessonInput>;

export type LessonCompleteResult = {
  lessonId: string;
  status: LessonStatus;
  moduleProgress: number;
  courseProgress: number;
};

// Modules
export const getModules = async (
  courseId: string,
  params: PaginationParams = {}
): Promise<Paginated<CourseModule>> => {
  const { data } = await apiClient.get<Paginated<CourseModule>>(
    `/courses/${courseId}/modules`,
    { params }
  );
  return data;
};

export const addModule = async (
  courseId: string,
  input: CreateModuleInput
): Promise<CourseModule> => {
  const { data } = await apiClient.post<CourseModule>(
    `/courses/${courseId}/modules`,
    input
  );
  return data;
};

export const updateModule = async (
  courseId: string,
  moduleId: string,
  input: UpdateModuleInput
): Promise<CourseModule> => {
  const { data } = await apiClient.patch<CourseModule>(
    `/courses/${courseId}/modules/${moduleId}`,
    input
  );
  return data;
};

export const deleteModule = async (courseId: string, moduleId: string): Promise<void> => {
  await apiClient.delete(`/courses/${courseId}/modules/${moduleId}`);
};

// Lessons (nested for listing/creation, flat for direct access)
export const getLessons = async (
  courseId: string,
  moduleId: string,
  params: PaginationParams = {}
): Promise<Paginated<Lesson>> => {
  const { data } = await apiClient.get<Paginated<Lesson>>(
    `/courses/${courseId}/modules/${moduleId}/lessons`,
    { params }
  );
  return data;
};

export const addLesson = async (
  courseId: string,
  moduleId: string,
  input: CreateLessonInput
): Promise<Lesson> => {
  const { data } = await apiClient.post<Lesson>(
    `/courses/${courseId}/modules/${moduleId}/lessons`,
    input
  );
  return data;
};

export const getLesson = async (lessonId: string): Promise<Lesson> => {
  const { data } = await apiClient.get<Lesson>(`/lessons/${lessonId}`);
  return data;
};

export const updateLesson = async (
  lessonId: string,
  input: UpdateLessonInput
): Promise<Lesson> => {
  const { data } = await apiClient.patch<Lesson>(`/lessons/${lessonId}`, input);
  return data;
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  await apiClient.delete(`/lessons/${lessonId}`);
};

export const completeLesson = async (lessonId: string): Promise<LessonCompleteResult> => {
  const { data } = await apiClient.post<LessonCompleteResult>(`/lessons/${lessonId}/complete`);
  return data;
};