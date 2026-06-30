import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadFile } from "@/api/uploads";
import { submitAssignment } from "@/api/assignments";
import { queryKeys } from "@/lib/query-keys";

type SubmitArgs = {
  assignmentId: string;
  file: File;
  content?: string;
};

/**
 * Uploads the file via POST /uploads, then submits the returned URL via
 * POST /assignments/:id/submissions, per the two-step flow in the docs.
 */
export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, file, content }: SubmitArgs) => {
      const upload = await uploadFile(file, "submission");
      await submitAssignment(assignmentId, { fileUrl: upload.url, content });
      return upload;
    },
    onSuccess: (_data, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.detail(assignmentId) });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}