import pool from "@/lib/db/pool";

export type DbEpreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string; // MySQL DATETIME => string
  id_sport: number;
  id_site: number;
};

export async function listEpreuves(): Promise<DbEpreuve[]> {
  const [rows] = await pool.query(`
    SELECT id_epreuve, nom_epreuve, date_heure, id_sport, id_site
    FROM epreuve
    ORDER BY date_heure ASC
  `);
  return rows as DbEpreuve[];
}

export async function getEpreuveById(id_epreuve: number): Promise<DbEpreuve | null> {
  const [rows] = await pool.query(
    `
    SELECT id_epreuve, nom_epreuve, date_heure, id_sport, id_site
    FROM epreuve
    WHERE id_epreuve = :id_epreuve
    LIMIT 1
    `,
    { id_epreuve }
  );
  const arr = rows as any[];
  return arr.length ? (arr[0] as DbEpreuve) : null;
}

export async function insertEpreuve(params: {
  nom_epreuve: string;
  date_heure: string; // formatted MySQL DATETIME
  id_sport: number;
  id_site: number;
}): Promise<number> {
  const [res] = await pool.query(
    `
    INSERT INTO epreuve (nom_epreuve, date_heure, id_sport, id_site)
    VALUES (:nom_epreuve, :date_heure, :id_sport, :id_site)
    `,
    params
  );
  return (res as any).insertId as number;
}

export async function updateEpreuve(params: {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  id_sport: number;
  id_site: number;
}): Promise<boolean> {
  const [res] = await pool.query(
    `
    UPDATE epreuve
    SET nom_epreuve = :nom_epreuve,
        date_heure = :date_heure,
        id_sport = :id_sport,
        id_site = :id_site
    WHERE id_epreuve = :id_epreuve
    `,
    params
  );
  return ((res as any).affectedRows as number) > 0;
}

export async function deleteEpreuve(id_epreuve: number): Promise<boolean> {
  const [res] = await pool.query(
    `DELETE FROM epreuve WHERE id_epreuve = :id_epreuve`,
    { id_epreuve }
  );
  return ((res as any).affectedRows as number) > 0;
}