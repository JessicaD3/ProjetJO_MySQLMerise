import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import pool from "@/lib/db/pool";

// Public: liste des athlètes avec leur pays
export const GET = handler(async () => {
  const [rows] = await pool.query(
    `
    SELECT
      a.id_athlete, a.nom, a.prenom, a.sexe, a.id_pays,
      p.nom_pays
    FROM athlete a
    JOIN pays p ON p.id_pays = a.id_pays
    ORDER BY a.nom ASC, a.prenom ASC
    `
  );

  return jsonOk(rows);
});