import { useQuery } from "@tanstack/react-query";

import { getAssignments, getAssignment } from "@/api/assignments";
import { queryKeys } from "@/lib/query-keys";

export function useAssignments() {
  return useQuery({
    queryKey: queryKeys.assignments.all(),
    queryFn: getAssignments,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: queryKeys.assignments.detail(id),
    queryFn: () => getAssignment(id),
    enabled: !!id,
  });
}