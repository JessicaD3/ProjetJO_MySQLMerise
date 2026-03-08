import pool from "@/lib/db/pool";

export type DbResultat = {
  id_athlete: number;
  id_epreuve: number;
  temps: string;
  classement: number;
};

export async function listResultats(): Promise<DbResultat[]> {
  const [rows] = await pool.query(
    `SELECT id_athlete, id_epreuve, temps, classement FROM resultat ORDER BY id_epreuve ASC, classement ASC`
  );
  return rows as DbResultat[];
}

export async function getResultat(id_athlete: number, id_epreuve: number): Promise<DbResultat | null> {
  const [rows] = await pool.query(
    `SELECT id_athlete, id_epreuve, temps, classement
     FROM resultat
     WHERE id_athlete = :id_athlete AND id_epreuve = :id_epreuve
     LIMIT 1`,
    { id_athlete, id_epreuve }
  );
  const arr = rows as any[];
  return arr.length ? (arr[0] as DbResultat) : null;
}

export async function insertResultat(params: DbResultat): Promise<void> {
  await pool.query(
    `INSERT INTO resultat (id_athlete, id_epreuve, temps, classement)
     VALUES (:id_athlete, :id_epreuve, :temps, :classement)`,
    params
  );
}

export async function updateResultat(params: DbResultat): Promise<boolean> {
  const [res] = await pool.query(
    `UPDATE resultat
     SET temps = :temps, classement = :classement
     WHERE id_athlete = :id_athlete AND id_epreuve = :id_epreuve`,
    params
  );
  return ((res as any).affectedRows as number) > 0;
}