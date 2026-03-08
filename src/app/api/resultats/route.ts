import { handler } from "@/lib/http/handler";
import { jsonOk, jsonCreated } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { resultatCreateSchema, resultatUpdateSchema } from "@/lib/validation/schemas";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/resultats.service";

export const GET = handler(async () => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);
  return jsonOk(await service.list());
});

export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, resultatCreateSchema);
  return jsonCreated(await service.create(body));
});

// PATCH par couple (body JSON)
export const PATCH = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, resultatUpdateSchema);
  return jsonOk(await service.update(body));
});