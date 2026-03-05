import { jsonError } from "./response";

// Function pour gérer les requêtes API avec une gestion centralisée des erreurs
export function handler(
  fn: (req: Request, ctx?: { params?: Record<string, string> }) => Promise<Response>
) {
  return async (req: Request, ctx?: { params?: Record<string, string> }) => {
    try {
      return await fn(req, ctx);
    } catch (err: any) {
      console.error("[API_ERROR]", err?.message ?? err);
      return jsonError(500, "INTERNAL_ERROR", "Unexpected server error");
    }
  };
}