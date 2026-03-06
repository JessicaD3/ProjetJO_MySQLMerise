import { handler } from "@/lib/http/handler";
import { jsonOk, jsonCreated, jsonError } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { sportCreateSchema } from "@/lib/validation/schemas";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/sports.service";

export const GET = handler(async () => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  return jsonOk(await service.list());
});

export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, sportCreateSchema);

  try {
    return jsonCreated(await service.create(body.nom_sport));
  } catch (e: any) {
    if (e?.code === "ER_DUP_ENTRY") return jsonError(409, "CONFLICT", "nom_sport already exists");
    throw e;
  }
});