import { handler } from "@/lib/http/handler";
import { jsonOk, jsonCreated } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { participationCreateSchema, participationDeleteSchema } from "@/lib/validation/schemas";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/participations.service";

export const GET = handler(async () => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);
  return jsonOk(await service.list());
});

export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, participationCreateSchema);
  return jsonCreated(await service.create(body));
});

// DELETE par couple (body JSON)
export const DELETE = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, participationDeleteSchema);
  return jsonOk(await service.remove(body.id_athlete, body.id_epreuve));
});