export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "CONFIG_ERROR"
  | "INTERNAL_ERROR"
  | "CAPACITY_REACHED";

export type ApiError = {
  code: ApiErrorCode;
  status: number;
  details?: unknown;
};

export function apiError(code: ApiErrorCode, status: number, details?: unknown): ApiError {
  return { code, status, details };
}