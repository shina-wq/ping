import { useQuery } from "@tanstack/react-query";

import {
  getAssignments,
  getCourseAssignments,
  getAssignment,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  type ListAssignmentsParams,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from "@/api/assignments";
import { useResourceMutation } from "@/hooks/use-resource-mutation";
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

// Mutations

export function useAddAssignment() {
  return useResourceMutation(
    ({ courseId, input }: { courseId: string; input: CreateAssignmentInput }) =>
      addAssignment(courseId, input),
    () => [["assignments"]]
  );
}

export function useUpdateAssignment() {
  return useResourceMutation(
    ({ id, input }: { id: string; input: UpdateAssignmentInput }) => updateAssignment(id, input),
    ({ id }) => [queryKeys.assignments.detail(id), ["assignments"]]
  );
}

export function useDeleteAssignment() {
  return useResourceMutation(
    (id: string) => deleteAssignment(id),
    () => [["assignments"]]
  );
}