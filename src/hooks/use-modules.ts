import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getModules,
  getLessons,
  getLesson,
  completeLesson,
} from "@/api/modules";
import { queryKeys } from "@/lib/query-keys";

export function useModules(courseId: string) {
  return useQuery({
    queryKey: queryKeys.modules.byCourse(courseId),
    queryFn: () => getModules(courseId),
    select: (res) => res.data,
    enabled: !!courseId,
  });
}

export function useLessons(courseId: string, moduleId: string) {
  return useQuery({
    queryKey: queryKeys.lessons.byModule(courseId, moduleId),
    queryFn: () => getLessons(courseId, moduleId),
    select: (res) => res.data,
    enabled: !!courseId && !!moduleId,
  });
}

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: queryKeys.lessons.detail(lessonId),
    queryFn: () => getLesson(lessonId),
    enabled: !!lessonId,
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeLesson,
    onSuccess: (_data, lessonId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.detail(lessonId) });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}