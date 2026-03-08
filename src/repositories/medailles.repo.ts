import pool from "@/lib/db/pool";

export type DbMedaille = {
  id_medaille: number;
  id_epreuve: number;
  id_athlete: number;
  type_medaille: "OR" | "ARGENT" | "BRONZE";
};

export async function listMedailles(): Promise<DbMedaille[]> {
  const [rows] = await pool.query(
    `SELECT id_medaille, id_epreuve, id_athlete, type_medaille
     FROM medaille
     ORDER BY id_epreuve ASC`
  );
  return rows as DbMedaille[];
}

export async function existsMedailleForEpreuveType(id_epreuve: number, type_medaille: string): Promise<boolean> {
  const [rows] = await pool.query(
    `SELECT 1 AS ok FROM medaille WHERE id_epreuve = :id_epreuve AND type_medaille = :type_medaille LIMIT 1`,
    { id_epreuve, type_medaille }
  );
  return (rows as any[]).length > 0;
}

export async function insertMedaille(params: {
  id_epreuve: number;
  id_athlete: number;
  type_medaille: "OR" | "ARGENT" | "BRONZE";
}): Promise<number> {
  const [res] = await pool.query(
    `INSERT INTO medaille (id_epreuve, id_athlete, type_medaille)
     VALUES (:id_epreuve, :id_athlete, :type_medaille)`,
    params
  );
  return (res as any).insertId as number;
}