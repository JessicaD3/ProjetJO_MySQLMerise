import pool from "@/lib/db/pool";

export type DbMedalsByCountry = {
  id_pays: number;
  nom_pays: string;
  or_count: number;
  argent_count: number;
  bronze_count: number;
  total: number;
};

export async function medalsByCountry(): Promise<DbMedalsByCountry[]> {
  const [rows] = await pool.query(
    `
    SELECT
      p.id_pays,
      p.nom_pays,
      SUM(CASE WHEN m.type_medaille = 'OR' THEN 1 ELSE 0 END)     AS or_count,
      SUM(CASE WHEN m.type_medaille = 'ARGENT' THEN 1 ELSE 0 END) AS argent_count,
      SUM(CASE WHEN m.type_medaille = 'BRONZE' THEN 1 ELSE 0 END) AS bronze_count,
      COUNT(*) AS total
    FROM medaille m
    JOIN athlete a ON a.id_athlete = m.id_athlete
    JOIN pays p ON p.id_pays = a.id_pays
    GROUP BY p.id_pays, p.nom_pays
    ORDER BY or_count DESC, argent_count DESC, bronze_count DESC, p.nom_pays ASC
    `
  );

  // mysql2 renvoie souvent des strings pour les aggregates -> on convertit
  return (rows as any[]).map((r) => ({
    id_pays: Number(r.id_pays),
    nom_pays: String(r.nom_pays),
    or_count: Number(r.or_count),
    argent_count: Number(r.argent_count),
    bronze_count: Number(r.bronze_count),
    total: Number(r.total),
  }));
}