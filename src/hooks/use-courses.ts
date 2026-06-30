import { useQuery } from "@tanstack/react-query";

import { getCourses, getCourse, type ListCoursesParams } from "@/api/courses";
import { queryKeys } from "@/lib/query-keys";

export function useCourses(params: ListCoursesParams = {}) {
  return useQuery({
    queryKey: queryKeys.courses.all(params),
    queryFn: () => getCourses(params),
    select: (res) => res.data,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => getCourse(id),
    enabled: !!id,
  });
}