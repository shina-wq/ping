import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addCourse,
  getCourses,
  getCourse,
  type CreateCourseInput,
  type ListCoursesParams,
} from "@/api/courses";
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

export function useAddCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCourseInput) => addCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all() });
    },
  });
}