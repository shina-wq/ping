import { useQuery } from "@tanstack/react-query";

import { getGrades, getGrade } from "@/api/grades";

export function useGrades() {
  return useQuery({
    queryKey: ["grades"],
    queryFn: getGrades,
  });
}

export function useGrade(id: string) {
  return useQuery({
    queryKey: ["grades", id],
    queryFn: () => getGrade(id),
    enabled: !!id,
  });
}