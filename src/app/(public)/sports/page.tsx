import SportsClient from "@/components/sports/SportsClient";
import pool from "@/lib/db/pool";

export const dynamic = "force-dynamic";

type SportCard = {
  id_sport: number;
  nom_sport: string;
  nb_epreuves: number;
  prochaine_date?: string | null;
};

export default async function SportsPage() {
  const [rows] = await pool.query(
    `
    SELECT
      s.id_sport,
      s.nom_sport,
      COUNT(e.id_epreuve) AS nb_epreuves,
      MIN(e.date_heure) AS prochaine_date
    FROM sport s
    LEFT JOIN epreuve e ON e.id_sport = s.id_sport
    GROUP BY s.id_sport, s.nom_sport
    ORDER BY s.nom_sport ASC
    `
  );

  const sports = (rows as any[]).map((row) => ({
    id_sport: Number(row.id_sport),
    nom_sport: String(row.nom_sport),
    nb_epreuves: Number(row.nb_epreuves ?? 0),
    prochaine_date: row.prochaine_date ?? null,
  })) as SportCard[];

  return <SportsClient sports={sports} />;
}