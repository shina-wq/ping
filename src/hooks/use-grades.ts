import { useQuery } from "@tanstack/react-query";

import { getGrades, getGrade, type ListGradesParams } from "@/api/grades";
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