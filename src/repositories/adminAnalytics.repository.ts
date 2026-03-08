import pool from "@/lib/db/pool";
import poolDw from "@/lib/db/pool-dw";

export async function countTable(
  tableName: "sport" | "athlete" | "epreuve"
): Promise<number> {
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM ${tableName}`);
  return Number((rows as any[])[0]?.total ?? 0);
}

export async function getOverviewCounts() {
  const [sports, athletes, epreuves] = await Promise.all([
    countTable("sport"),
    countTable("athlete"),
    countTable("epreuve"),
  ]);

  return {
    sports,
    athletes,
    epreuves,
  };
}

export async function getTicketsRevenue() {
  const [rows] = await poolDw.query(`
    SELECT
      COALESCE(SUM(nb_billets), 0) AS tickets_sold,
      COALESCE(SUM(chiffre_affaires), 0) AS revenue
    FROM fact_billets
  `);

  return (rows as any[])[0] ?? null;
}

export async function getMedalCountries() {
  const [rows] = await poolDw.query(`
    SELECT COUNT(DISTINCT id_pays) AS medal_countries
    FROM fact_resultats
    WHERE nb_medailles_or > 0
       OR nb_medailles_argent > 0
       OR nb_medailles_bronze > 0
  `);

  return (rows as any[])[0] ?? null;
}

export async function getAverageFillRate() {
  const [rows] = await poolDw.query(`
    SELECT ROUND(AVG(fill_rate), 2) AS avg_fill_rate
    FROM (
      SELECT
        fb.id_epreuve,
        (SUM(fb.nb_billets) * 100.0 / ds.capacite) AS fill_rate
      FROM fact_billets fb
      JOIN dim_site ds ON ds.id_site = fb.id_site
      GROUP BY fb.id_epreuve, ds.capacite
    ) x
  `);

  return (rows as any[])[0] ?? null;
}

export async function getSalesOverTime() {
  const [rows] = await poolDw.query(`
    SELECT
      dd.date_complete,
      SUM(fb.nb_billets) AS nb_billets,
      SUM(fb.chiffre_affaires) AS ca
    FROM fact_billets fb
    JOIN dim_date dd ON dd.id_date = fb.id_date
    GROUP BY dd.date_complete
    ORDER BY dd.date_complete
  `);

  return rows as any[];
}

export async function getRevenueBySport() {
  const [rows] = await poolDw.query(`
    SELECT
      ds.nom_sport,
      SUM(fb.chiffre_affaires) AS chiffre_affaires
    FROM fact_billets fb
    JOIN dim_sport ds ON ds.id_sport = fb.id_sport
    GROUP BY ds.nom_sport
    ORDER BY chiffre_affaires DESC
  `);

  return rows as any[];
}

export async function getTopEvents() {
  const [rows] = await poolDw.query(`
    SELECT
      de.nom_epreuve,
      SUM(fb.nb_billets) AS billets_vendus,
      SUM(fb.chiffre_affaires) AS ca
    FROM fact_billets fb
    JOIN dim_epreuve de ON de.id_epreuve = fb.id_epreuve
    GROUP BY de.id_epreuve, de.nom_epreuve
    ORDER BY billets_vendus DESC, ca DESC
    LIMIT 5
  `);

  return rows as any[];
}

export async function getRecentSales() {
  const [rows] = await pool.query(`
    SELECT
      b.id_billet,
      b.nom,
      b.prenom,
      b.prix_achat,
      b.date_achat,
      e.nom_epreuve
    FROM billet b
    JOIN epreuve e ON e.id_epreuve = b.id_epreuve
    ORDER BY b.date_achat DESC, b.id_billet DESC
    LIMIT 5
  `);

  return rows as any[];
}

export async function getForecastTomorrow() {
  const [rows] = await poolDw.query(`
    SELECT ROUND(AVG(nb_billets), 0) AS forecast_tomorrow
    FROM (
      SELECT SUM(fb.nb_billets) AS nb_billets
      FROM fact_billets fb
      GROUP BY fb.id_date
    ) t
  `);

  return (rows as any[])[0] ?? null;
}

export async function getBestSport() {
  const [rows] = await poolDw.query(`
    SELECT
      ds.nom_sport,
      SUM(fb.chiffre_affaires) AS chiffre_affaires
    FROM fact_billets fb
    JOIN dim_sport ds ON ds.id_sport = fb.id_sport
    GROUP BY ds.id_sport, ds.nom_sport
    ORDER BY chiffre_affaires DESC
    LIMIT 1
  `);

  return (rows as any[])[0] ?? null;
}

export async function getBestSite() {
  const [rows] = await poolDw.query(`
    SELECT
      ds.nom_site,
      ROUND(SUM(fb.nb_billets) * 100.0 / ds.capacite, 2) AS fill_rate
    FROM fact_billets fb
    JOIN dim_site ds ON ds.id_site = fb.id_site
    GROUP BY ds.id_site, ds.nom_site, ds.capacite
    ORDER BY fill_rate DESC
    LIMIT 1
  `);

  return (rows as any[])[0] ?? null;
}