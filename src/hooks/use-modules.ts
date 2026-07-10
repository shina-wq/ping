import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getModules,
  getLessons,
  getLesson,
  addModule,
  updateModule,
  deleteModule,
  completeLesson,
  type CreateModuleInput,
  type UpdateModuleInput,
} from "@/api/modules";
import { useResourceMutation } from "@/hooks/use-resource-mutation";
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

// Mutations

export function useAddModule() {
  return useResourceMutation(
    ({ courseId, input }: { courseId: string; input: CreateModuleInput }) => addModule(courseId, input),
    () => [["modules"]]
  );
}

export function useUpdateModule() {
  return useResourceMutation(
    ({ courseId, moduleId, input }: { courseId: string; moduleId: string; input: UpdateModuleInput }) =>
      updateModule(courseId, moduleId, input),
    () => [["modules"]]
  );
}

export function useDeleteModule() {
  return useResourceMutation(
    ({ courseId, moduleId }: { courseId: string; moduleId: string }) => deleteModule(courseId, moduleId),
    () => [["modules"]]
  );
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