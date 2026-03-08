import pool from "@/lib/db/pool";

export type DbSite = { id_site: number; nom_site: string; capacite: number };

export async function listSites(): Promise<DbSite[]> {
  const [rows] = await pool.query(
    `SELECT id_site, nom_site, capacite FROM site ORDER BY nom_site ASC`
  );
  return rows as DbSite[];
}

export async function getSiteById(id_site: number): Promise<DbSite | null> {
  const [rows] = await pool.query(
    `SELECT id_site, nom_site, capacite FROM site WHERE id_site = :id_site LIMIT 1`,
    { id_site }
  );
  const arr = rows as any[];
  return arr.length ? (arr[0] as DbSite) : null;
}

export async function insertSite(params: { nom_site: string; capacite: number }): Promise<number> {
  const [res] = await pool.query(
    `INSERT INTO site (nom_site, capacite) VALUES (:nom_site, :capacite)`,
    params
  );
  return (res as any).insertId as number;
}

export async function updateSite(params: { id_site: number; nom_site: string; capacite: number }): Promise<boolean> {
  const [res] = await pool.query(
    `UPDATE site SET nom_site = :nom_site, capacite = :capacite WHERE id_site = :id_site`,
    params
  );
  return ((res as any).affectedRows as number) > 0;
}

export async function deleteSite(id_site: number): Promise<boolean> {
  const [res] = await pool.query(
    `DELETE FROM site WHERE id_site = :id_site`,
    { id_site }
  );
  return ((res as any).affectedRows as number) > 0;
}