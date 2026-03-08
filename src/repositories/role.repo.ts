import pool from "@/lib/db/pool";

// Function pour trouver l'ID d'un rôle dans la base de données à partir de son nom
export async function findRoleIdByName(nom_role: string): Promise<number | null> {
  const [rows] = await pool.query(
    `SELECT id_role FROM role WHERE nom_role = :nom_role LIMIT 1`,
    { nom_role }
  );

  const arr = rows as any[];
  return arr.length ? (arr[0].id_role as number) : null;
}