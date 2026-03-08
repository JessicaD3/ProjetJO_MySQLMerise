import { handler } from "@/lib/http/handler";
import { jsonOk, jsonError } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { sportUpdateSchema } from "@/lib/validation/schemas";
import { apiError } from "@/lib/http/errors";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import * as service from "@/services/sports.service";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!id || Number.isNaN(n) || n <= 0) throw apiError("BAD_REQUEST", 400, "Invalid id");
  return n;
}

export const GET = handler<Ctx>(async (_req, ctx) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const id = await parseId(ctx);
  return jsonOk(await service.get(id));
});

export const PATCH = handler<Ctx>(async (req, ctx) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const id = await parseId(ctx);
  const body = await validateBody(req, sportUpdateSchema);

  try {
    return jsonOk(await service.update(id, body.nom_sport));
  } catch (e: any) {
    if (e?.code === "ER_DUP_ENTRY") return jsonError(409, "CONFLICT", "nom_sport already exists");
    throw e;
  }
});

export const DELETE = handler<Ctx>(async (_req, ctx) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const id = await parseId(ctx);
  return jsonOk(await service.remove(id));
});