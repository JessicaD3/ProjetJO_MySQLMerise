import pool from "@/lib/db/pool";

// Type représentant un pays tel qu'il est stocké dans la base de données
export type DbPays = { id_pays: number; nom_pays: string };

// Fonctions de gestion des pays dans la base de données
export async function listPays(): Promise<DbPays[]> {
  const [rows] = await pool.query(`SELECT id_pays, nom_pays FROM pays ORDER BY nom_pays ASC`);
  return rows as DbPays[];
}

// Fonction pour récupérer un pays par son ID
export async function getPaysById(id_pays: number): Promise<DbPays | null> {
  const [rows] = await pool.query(
    `SELECT id_pays, nom_pays FROM pays WHERE id_pays = :id_pays LIMIT 1`,
    { id_pays }
  );
  const arr = rows as any[];
  return arr.length ? (arr[0] as DbPays) : null;
}

// Fonction pour insérer un nouveau pays dans la base de données
export async function insertPays(nom_pays: string): Promise<number> {
  const [res] = await pool.query(
    `INSERT INTO pays (nom_pays) VALUES (:nom_pays)`,
    { nom_pays }
  );
  return (res as any).insertId as number;
}

// Fonction pour mettre à jour le nom d'un pays existant
export async function updatePays(id_pays: number, nom_pays: string): Promise<boolean> {
  const [res] = await pool.query(
    `UPDATE pays SET nom_pays = :nom_pays WHERE id_pays = :id_pays`,
    { id_pays, nom_pays }
  );
  return ((res as any).affectedRows as number) > 0;
}

// Fonction pour supprimer un pays de la base de données
export async function deletePays(id_pays: number): Promise<boolean> {
  const [res] = await pool.query(
    `DELETE FROM pays WHERE id_pays = :id_pays`,
    { id_pays }
  );
  return ((res as any).affectedRows as number) > 0;
}