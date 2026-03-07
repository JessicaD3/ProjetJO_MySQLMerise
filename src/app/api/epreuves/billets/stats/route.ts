import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import pool from "@/lib/db/pool";

export const GET = handler(async () => {
  const [rows] = await pool.query(
    `
    SELECT
      e.id_epreuve,
      e.nom_epreuve,
      e.date_heure,
      s.nom_sport,
      si.nom_site,
      si.capacite,
      COALESCE(b.sold, 0) AS sold,
      GREATEST(si.capacite - COALESCE(b.sold, 0), 0) AS remaining
    FROM epreuve e
    JOIN sport s ON s.id_sport = e.id_sport
    JOIN site si ON si.id_site = e.id_site
    LEFT JOIN (
      SELECT id_epreuve, COUNT(*) AS sold
      FROM billet
      GROUP BY id_epreuve
    ) b ON b.id_epreuve = e.id_epreuve
    ORDER BY e.date_heure ASC
    `
  );

  return jsonOk(rows);
});