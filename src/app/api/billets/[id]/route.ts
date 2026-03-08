import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { apiError } from "@/lib/http/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/billets.service";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!id || Number.isNaN(n) || n <= 0) throw apiError("BAD_REQUEST", 400, "Invalid id");
  return n;
}

export const GET = handler<Ctx>(async (_req, ctx) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "AGENT_BILLETTERIE"]);

  return jsonOk(await service.get(await parseId(ctx)));
});