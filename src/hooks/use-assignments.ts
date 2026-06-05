import { useQuery } from "@tanstack/react-query";

import { getAssignments, getAssignment } from "@/api/assignments";

export function useAssignments() {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: getAssignments,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: () => getAssignment(id),
    enabled: !!id,
  });
}