import { jsonError } from "./response";
import type { ApiError } from "./errors";

// Function pour vérifier si une erreur est une ApiError, en vérifiant la présence des propriétés code et status
function isApiError(err: any): err is ApiError {
  return err && typeof err === "object" && typeof err.code === "string" && typeof err.status === "number";
}

//  Function pour créer un handler d'API qui gère les erreurs de manière centralisée, en utilisant la fonction jsonError pour formater les réponses d'erreur
export function handler(
  fn: (req: Request, ctx?: { params?: Record<string, string> }) => Promise<Response>
) {
  return async (req: Request, ctx?: { params?: Record<string, string> }) => {
    try {
      return await fn(req, ctx);
    } catch (err: any) {
      if (isApiError(err)) {
        return jsonError(err.status, err.code, err.details);
      }

      // compat si quelqu’un throw new Error("UNAUTHORIZED")
      if (err?.message === "UNAUTHORIZED") return jsonError(401, "UNAUTHORIZED", "Login required");
      if (err?.message === "FORBIDDEN") return jsonError(403, "FORBIDDEN", "Insufficient role");

      console.error("[API_ERROR]", err?.message ?? err);
      return jsonError(500, "INTERNAL_ERROR", "Unexpected server error");
    }
  };
}