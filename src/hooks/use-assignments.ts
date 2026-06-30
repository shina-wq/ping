import { useQuery } from "@tanstack/react-query";

import {
  getAssignments,
  getCourseAssignments,
  getAssignment,
  type ListAssignmentsParams,
} from "@/api/assignments";
import { queryKeys } from "@/lib/query-keys";

export function useAssignments(params: ListAssignmentsParams = {}) {
  return useQuery({
    queryKey: queryKeys.assignments.all(params),
    queryFn: () => getAssignments(params),
    select: (res) => res.data,
  });
}

export function useCourseAssignments(courseId: string, params: ListAssignmentsParams = {}) {
  return useQuery({
    queryKey: queryKeys.assignments.byCourse(courseId, params),
    queryFn: () => getCourseAssignments(courseId, params),
    select: (res) => res.data,
    enabled: !!courseId,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: queryKeys.assignments.detail(id),
    queryFn: () => getAssignment(id),
    enabled: !!id,
  });
}