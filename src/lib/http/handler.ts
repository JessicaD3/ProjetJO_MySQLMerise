import { jsonError } from "./response";
import type { ApiError } from "./errors";

function isApiError(err: any): err is ApiError {
  return err && typeof err === "object" && typeof err.code === "string" && typeof err.status === "number";
}

export function handler<TCtx>(
  fn: (req: Request, ctx: TCtx) => Promise<Response>
) {
  return async (req: Request, ctx: TCtx) => {
    try {
      return await fn(req, ctx);
    } catch (err: any) {
      if (isApiError(err)) {
        return jsonError(err.status, err.code, err.details);
      }


      if (err?.code === "UNAUTHORIZED") return jsonError(401, "UNAUTHORIZED", "Login required");
      if (err?.code === "FORBIDDEN") return jsonError(403, "FORBIDDEN", "Insufficient role");


      if (err?.message === "UNAUTHORIZED") return jsonError(401, "UNAUTHORIZED", "Login required");
      if (err?.message === "FORBIDDEN") return jsonError(403, "FORBIDDEN", "Insufficient role");

      console.error("[API_ERROR]", err?.message ?? err);
      return jsonError(500, "INTERNAL_ERROR", "Unexpected server error");
    }
  };
}