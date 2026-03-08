import { handler } from "@/lib/http/handler";
import { jsonOk, jsonCreated } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { epreuveCreateSchema } from "@/lib/validation/schemas";
import { getSessionUser, requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/epreuves.service";

// ✅ Public: lecture
export const GET = handler(async () => {
  // pas d'auth requise
  return jsonOk(await service.list());
});

// 🔒 Protégé: création
export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, epreuveCreateSchema);
  return jsonCreated(await service.create(body));
});