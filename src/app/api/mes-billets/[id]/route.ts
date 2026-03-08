import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { apiError } from "@/lib/http/errors";
import { requireAuth } from "@/lib/auth/session";
import pool from "@/lib/db/pool";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!id || Number.isNaN(n) || n <= 0) throw apiError("BAD_REQUEST", 400, "Invalid id");
  return n;
}

export const GET = handler<Ctx>(async (_req, ctx) => {
  const user = await requireAuth();
  const id_billet = await parseId(ctx);

  const [rows] = await pool.query(
    `SELECT * FROM billet WHERE id_billet = :id_billet LIMIT 1`,
    { id_billet }
  );

  const arr = rows as any[];
  if (!arr.length) throw apiError("NOT_FOUND", 404, "Billet not found");

  const billet = arr[0];
  if (Number(billet.id_utilisateur) !== user.id_utilisateur) {
    throw apiError("FORBIDDEN", 403, "Not your billet");
  }

  return jsonOk(billet);
});