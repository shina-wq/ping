import { useQuery } from "@tanstack/react-query";

import { getStudentDashboardStats, getTeacherDashboardStats } from "@/api/dashboard";
import { useAuth } from "@/contexts/auth-context";
import { queryKeys } from "@/lib/query-keys";

/**
 * Calls /dashboard/student or /dashboard/teacher based on the
 * authenticated user's role. The teacher dashboard UI doesn't exist yet —
 * this hook just fetches the right stats shape so the teacher view can be
 * built against it later.
 */
export function useStudentDashboardStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.student(),
    queryFn: getStudentDashboardStats,
    enabled,
  });
}

export function useTeacherDashboardStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.teacher(),
    queryFn: getTeacherDashboardStats,
    enabled,
  });
}

/**
 * Convenience hook: picks the right dashboard query based on role and
 * gates the *other* one off via `enabled` so only one network request
 * actually fires.
 */
export function useDashboardStats() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const studentQuery = useStudentDashboardStats(!isTeacher);
  const teacherQuery = useTeacherDashboardStats(isTeacher);

  return isTeacher ? teacherQuery : studentQuery;
}