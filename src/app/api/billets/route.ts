import { handler } from "@/lib/http/handler";
import { jsonOk, jsonCreated } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { billetCreateSchema } from "@/lib/validation/schemas";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/billets.service";

export const GET = handler(async () => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "AGENT_BILLETTERIE"]);

  return jsonOk(await service.list());
});

export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "AGENT_BILLETTERIE"]);

  const body = await validateBody(req, billetCreateSchema);

  const created = await service.create({
    ...body,
    id_utilisateur: user.id_utilisateur, 
  });

  return jsonCreated(created);
});