import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { requireAuth } from "@/lib/auth/session";
import pool from "@/lib/db/pool";

export const GET = handler(async () => {
  const user = await requireAuth();

  const [rows] = await pool.query(
    `
    SELECT b.*
    FROM billet b
    WHERE b.id_utilisateur = :id_utilisateur
    ORDER BY b.date_achat DESC
    `,
    { id_utilisateur: user.id_utilisateur }
  );

  return jsonOk(rows);
});