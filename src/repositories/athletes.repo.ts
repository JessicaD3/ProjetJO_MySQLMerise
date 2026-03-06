import pool from "@/lib/db/pool";

export type DbAthlete = {
  id_athlete: number;
  nom: string;
  prenom: string;
  sexe: string;
  id_pays: number;
};

export async function listAthletes(): Promise<DbAthlete[]> {
  const [rows] = await pool.query(
    `SELECT id_athlete, nom, prenom, sexe, id_pays FROM athlete ORDER BY nom ASC, prenom ASC`
  );
  return rows as DbAthlete[];
}

export async function getAthleteById(id_athlete: number): Promise<DbAthlete | null> {
  const [rows] = await pool.query(
    `SELECT id_athlete, nom, prenom, sexe, id_pays FROM athlete WHERE id_athlete = :id_athlete LIMIT 1`,
    { id_athlete }
  );
  const arr = rows as any[];
  return arr.length ? (arr[0] as DbAthlete) : null;
}

export async function insertAthlete(params: {
  nom: string;
  prenom: string;
  sexe: string;
  id_pays: number;
}): Promise<number> {
  const [res] = await pool.query(
    `INSERT INTO athlete (nom, prenom, sexe, id_pays)
     VALUES (:nom, :prenom, :sexe, :id_pays)`,
    params
  );
  return (res as any).insertId as number;
}

export async function updateAthlete(params: {
  id_athlete: number;
  nom: string;
  prenom: string;
  sexe: string;
  id_pays: number;
}): Promise<boolean> {
  const [res] = await pool.query(
    `UPDATE athlete
     SET nom = :nom, prenom = :prenom, sexe = :sexe, id_pays = :id_pays
     WHERE id_athlete = :id_athlete`,
    params
  );
  return ((res as any).affectedRows as number) > 0;
}

export async function deleteAthlete(id_athlete: number): Promise<boolean> {
  const [res] = await pool.query(
    `DELETE FROM athlete WHERE id_athlete = :id_athlete`,
    { id_athlete }
  );
  return ((res as any).affectedRows as number) > 0;
}