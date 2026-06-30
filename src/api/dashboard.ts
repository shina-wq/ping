import { apiClient } from "@/api/client";

export type StudentDashboardStats = {
  activeCourses: number;
  pendingAssignments: number;
  averageGrade: number;         // percentage e.g. 79
  assignmentsDueThisWeek: number;
};

export type TeacherDashboardStats = {
  activeCourses: number;
  totalStudents: number;
  pendingSubmissions: number;
  averageClassGrade: number;
  assignmentsPublishedThisWeek: number;
};

export const getStudentDashboardStats = async (): Promise<StudentDashboardStats> => {
  const { data } = await apiClient.get<StudentDashboardStats>("/dashboard/student");
  return data;
};

export const getTeacherDashboardStats = async (): Promise<TeacherDashboardStats> => {
  const { data } = await apiClient.get<TeacherDashboardStats>("/dashboard/teacher");
  return data;
};