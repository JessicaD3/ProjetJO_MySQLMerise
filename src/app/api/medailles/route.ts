import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/medailles.service";

export const GET = handler(async () => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  return jsonOk(await service.list());
});