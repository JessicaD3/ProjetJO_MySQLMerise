import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { requireAuth } from "@/lib/auth/session";

// Route GET /api/auth/me pour récupérer les informations de l'utilisateur connecté
export const GET = handler(async () => {
  const user = await requireAuth();
  return jsonOk(user);
});