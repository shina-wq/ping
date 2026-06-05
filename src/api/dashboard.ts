import { apiClient } from "@/api/client";

// Types

export type DashboardStats = {
  activeCourses: number;
  pendingAssignments: number;
  averageGrade: number;        // percentage, e.g. 79
  assignmentsDueThisWeek: number;
};

// Requests

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
  return data;
}