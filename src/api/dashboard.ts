import { apiClient } from "@/api/client";

export type DashboardStats = {
  activeCourses: number;
  pendingAssignments: number;
  averageGrade: number;         // percentage e.g. 79
  assignmentsDueThisWeek: number;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
  return data;
};