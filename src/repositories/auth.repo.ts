import pool from "@/lib/db/pool";

export type DbUserWithRole = {
  id_utilisateur: number;
  login: string;
  mot_de_passe: string;
  id_role: number;
  nom_role: string;
};

// Function pour trouver un utilisateur dans la base de données à partir de son login
export async function findUserByLogin(login: string): Promise<DbUserWithRole | null> {
  const [rows] = await pool.query(
    `
    SELECT u.id_utilisateur, u.login, u.mot_de_passe, u.id_role, r.nom_role
    FROM utilisateur u
    JOIN role r ON r.id_role = u.id_role
    WHERE u.login = :login
    LIMIT 1
    `,
    { login }
  );

  const arr = rows as any[];
  return arr.length ? (arr[0] as DbUserWithRole) : null;
}

// Function pour insérer un nouvel utilisateur dans la base de données et retourner son ID
export async function insertUser(params: {
  login: string;
  mot_de_passe: string;
  id_role: number;
}): Promise<number> {
  const [res] = await pool.query(
    `
    INSERT INTO utilisateur (login, mot_de_passe, id_role)
    VALUES (:login, :mot_de_passe, :id_role)
    `,
    params
  );

  const r: any = res;
  return r.insertId as number;
}