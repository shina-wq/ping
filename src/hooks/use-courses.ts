import { useQuery } from "@tanstack/react-query";

import {
  addCourse,
  getCourses,
  getCourse,
  updateCourse,
  type CreateCourseInput,
  type ListCoursesParams,
  type UpdateCourseInput,
} from "@/api/courses";
import { useResourceMutation } from "@/hooks/use-resource-mutation";
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

// Mutations

export function useAddCourse() {
  return useResourceMutation(
    (input: CreateCourseInput) => addCourse(input),
    () => [["courses"]]
  );
}

export function useUpdateCourse() {
  return useResourceMutation(
    ({ id, input }: { id: string; input: UpdateCourseInput }) => updateCourse(id, input),
    ({ id }) => [queryKeys.courses.detail(id), ["courses"]]
  );
}