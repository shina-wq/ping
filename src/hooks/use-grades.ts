import { useQuery } from "@tanstack/react-query";

import { getGrades, getGrade } from "@/api/grades";
import { queryKeys } from "@/lib/query-keys";

export function useGrades() {
  return useQuery({
    queryKey: queryKeys.grades.all(),
    queryFn: getGrades,
  });
}

export function useGrade(id: string) {
  return useQuery({
    queryKey: queryKeys.grades.detail(id),
    queryFn: () => getGrade(id),
    enabled: !!id,
  });
}