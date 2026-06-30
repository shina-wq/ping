import { apiClient } from "@/api/client";

export type UploadContext = "submission" | "avatar" | "lesson-asset";

export type UploadResult = {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  context: UploadContext;
};

export const uploadFile = async (file: File, context: UploadContext): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", context);

  const { data } = await apiClient.post<UploadResult>("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};