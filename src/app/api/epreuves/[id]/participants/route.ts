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

// GET /api/epreuves/:id/participants (public)
export const GET = handler<Ctx>(async (_req, ctx) => {
  const id_epreuve = await parseId(ctx);

  const [rows] = await pool.query(
    `
    SELECT 
      a.id_athlete, a.nom, a.prenom, a.sexe,
      p.nom_pays
    FROM participation pa
    JOIN athlete a ON a.id_athlete = pa.id_athlete
    JOIN pays p ON p.id_pays = a.id_pays
    WHERE pa.id_epreuve = :id_epreuve
    ORDER BY a.nom ASC, a.prenom ASC
    `,
    { id_epreuve }
  );

  return jsonOk(rows);
});