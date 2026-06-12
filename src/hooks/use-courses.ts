import { useQuery } from "@tanstack/react-query";

import { getCourses, getCourse } from "@/api/courses";
import { queryKeys } from "@/lib/query-keys";

export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.all(),
    queryFn: getCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => getCourse(id),
    enabled: !!id,
  });
}