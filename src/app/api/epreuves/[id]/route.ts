import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { apiError } from "@/lib/http/errors";
import pool from "@/lib/db/pool";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!id || Number.isNaN(n) || n <= 0) throw apiError("BAD_REQUEST", 400, "Invalid id");
  return n;
}

// ✅ Public: lecture détail épreuve
export const GET = handler<Ctx>(async (_req, ctx) => {
  const id_epreuve = await parseId(ctx);

  const [rows] = await pool.query(
    `
    SELECT
      e.id_epreuve,
      e.nom_epreuve,
      e.date_heure,
      e.id_sport,
      sp.nom_sport,
      e.id_site,
      si.nom_site,
      si.capacite
    FROM epreuve e
    JOIN sport sp ON sp.id_sport = e.id_sport
    JOIN site si ON si.id_site = e.id_site
    WHERE e.id_epreuve = :id_epreuve
    LIMIT 1
    `,
    { id_epreuve }
  );

  const arr = rows as any[];
  if (!arr.length) throw apiError("NOT_FOUND", 404, "Epreuve not found");

  return jsonOk(arr[0]);
});