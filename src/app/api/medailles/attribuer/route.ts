import { handler } from "@/lib/http/handler";
import { jsonCreated } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { medalAttribuerSchema } from "@/lib/validation/schemas";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/medailles.service";

export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, medalAttribuerSchema);
  return jsonCreated(await service.attribuer(body));
});