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

export const GET = handler<Ctx>(async (_req, ctx) => {
  const id_epreuve = await parseId(ctx);

  const [e] = await pool.query(
    `SELECT 1 AS ok FROM epreuve WHERE id_epreuve = :id_epreuve LIMIT 1`,
    { id_epreuve }
  );
  if ((e as any[]).length === 0) throw apiError("NOT_FOUND", 404, "Epreuve not found");

  const [rows] = await pool.query(
    `
    SELECT
      r.id_athlete,
      a.nom,
      a.prenom,
      p.nom_pays,
      r.temps,
      r.classement
    FROM resultat r
    JOIN athlete a ON a.id_athlete = r.id_athlete
    JOIN pays p ON p.id_pays = a.id_pays
    WHERE r.id_epreuve = :id_epreuve
    ORDER BY r.classement ASC
    `,
    { id_epreuve }
  );

  return jsonOk(rows);
});