import { useQuery } from "@tanstack/react-query";

import {
  getGrades,
  getGrade,
  createGrade,
  updateGrade,
  deleteGrade,
  type ListGradesParams,
  type CreateGradeInput,
  type UpdateGradeInput,
} from "@/api/grades";
import { useResourceMutation } from "@/hooks/use-resource-mutation";
import { queryKeys } from "@/lib/query-keys";

export function useGrades(params: ListGradesParams = {}) {
  return useQuery({
    queryKey: queryKeys.grades.all(params),
    queryFn: () => getGrades(params),
    select: (res) => res.data,
  });
}

export function useGrade(id: string) {
  return useQuery({
    queryKey: queryKeys.grades.detail(id),
    queryFn: () => getGrade(id),
    enabled: !!id,
  });
}

// Mutations

export function useCreateGrade() {
  return useResourceMutation(
    (input: CreateGradeInput) => createGrade(input),
    () => [["grades"]]
  );
}

export function useUpdateGrade() {
  return useResourceMutation(
    ({ id, input }: { id: string; input: UpdateGradeInput }) => updateGrade(id, input),
    ({ id }) => [queryKeys.grades.detail(id), ["grades"]]
  );
}

export function useDeleteGrade() {
  return useResourceMutation(
    (id: string) => deleteGrade(id),
    () => [["grades"]]
  );
}