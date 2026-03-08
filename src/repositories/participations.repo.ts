import pool from "@/lib/db/pool";

export type DbParticipation = {
  id_athlete: number;
  id_epreuve: number;
  inscription: string | null;
};

export async function listParticipations(): Promise<DbParticipation[]> {
  const [rows] = await pool.query(
    `SELECT id_athlete, id_epreuve, inscription FROM participation ORDER BY id_epreuve ASC, id_athlete ASC`
  );
  return rows as DbParticipation[];
}

export async function existsParticipation(id_athlete: number, id_epreuve: number): Promise<boolean> {
  const [rows] = await pool.query(
    `SELECT 1 AS ok FROM participation WHERE id_athlete = :id_athlete AND id_epreuve = :id_epreuve LIMIT 1`,
    { id_athlete, id_epreuve }
  );
  return (rows as any[]).length > 0;
}

export async function insertParticipation(params: {
  id_athlete: number;
  id_epreuve: number;
  inscription: string | null;
}): Promise<void> {
  await pool.query(
    `INSERT INTO participation (id_athlete, id_epreuve, inscription)
     VALUES (:id_athlete, :id_epreuve, :inscription)`,
    params
  );
}

export async function deleteParticipation(id_athlete: number, id_epreuve: number): Promise<boolean> {
  const [res] = await pool.query(
    `DELETE FROM participation WHERE id_athlete = :id_athlete AND id_epreuve = :id_epreuve`,
    { id_athlete, id_epreuve }
  );
  return ((res as any).affectedRows as number) > 0;
}