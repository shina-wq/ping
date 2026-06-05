import { useQuery } from "@tanstack/react-query";

import { getCourses, getCourse } from "@/api/courses";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => getCourse(id),
    enabled: !!id,
  });
}