import type { AxiosError } from "axios";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isServerError() {
    return this.status >= 500;
  }
}

export function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<{ message?: string; code?: string }>;

  if (axiosError.response) {
    const status = axiosError.response.status;
    const message =
      axiosError.response.data?.message ??
      axiosError.message ??
      "An unexpected error occurred.";
    const code = axiosError.response.data?.code;
    return new ApiError(message, status, code);
  }

  if (axiosError.request) {
    return new ApiError("Network error — please check your connection.", 0);
  }

  return new ApiError(
    error instanceof Error ? error.message : "An unexpected error occurred.",
    0
  );
}
