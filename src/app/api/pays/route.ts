import { handler } from "@/lib/http/handler";
import { jsonOk, jsonCreated, jsonError } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { paysCreateSchema } from "@/lib/validation/schemas";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/pays.service";

// Route GET /api/pays pour récupérer la liste de tous les pays, accessible uniquement aux utilisateurs avec le rôle ADMIN ou ORGANISATEUR
export const GET = handler(async () => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const data = await service.list();
  return jsonOk(data);
});

// Route POST /api/pays pour créer un nouveau pays, accessible uniquement aux utilisateurs avec le rôle ADMIN ou ORGANISATEUR
export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, paysCreateSchema);

  try {
    const created = await service.create(body.nom_pays);
    return jsonCreated(created);
  } catch (e: any) {
    // unique constraint MySQL => ER_DUP_ENTRY
    if (e?.code === "ER_DUP_ENTRY") {
      return jsonError(409, "CONFLICT", "nom_pays already exists");
    }
    throw e;
  }
});