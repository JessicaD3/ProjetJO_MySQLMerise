import pool from "@/lib/db/pool";

export type DbSport = { id_sport: number; nom_sport: string };

export async function listSports(): Promise<DbSport[]> {
  const [rows] = await pool.query(`SELECT id_sport, nom_sport FROM sport ORDER BY nom_sport ASC`);
  return rows as DbSport[];
}

export async function getSportById(id_sport: number): Promise<DbSport | null> {
  const [rows] = await pool.query(
    `SELECT id_sport, nom_sport FROM sport WHERE id_sport = :id_sport LIMIT 1`,
    { id_sport }
  );
  const arr = rows as any[];
  return arr.length ? (arr[0] as DbSport) : null;
}

export async function insertSport(nom_sport: string): Promise<number> {
  const [res] = await pool.query(
    `INSERT INTO sport (nom_sport) VALUES (:nom_sport)`,
    { nom_sport }
  );
  return (res as any).insertId as number;
}

export async function updateSport(id_sport: number, nom_sport: string): Promise<boolean> {
  const [res] = await pool.query(
    `UPDATE sport SET nom_sport = :nom_sport WHERE id_sport = :id_sport`,
    { id_sport, nom_sport }
  );
  return ((res as any).affectedRows as number) > 0;
}

export async function deleteSport(id_sport: number): Promise<boolean> {
  const [res] = await pool.query(
    `DELETE FROM sport WHERE id_sport = :id_sport`,
    { id_sport }
  );
  return ((res as any).affectedRows as number) > 0;
}