import mysql from "mysql2/promise";

// Function pour vérifier que les variables d'environnement nécessaires sont présentes
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

// Création du pool de connexions MySQL
const pool = mysql.createPool({
  host: required("DB_HOST", process.env.DB_HOST),
  port: Number(required("DB_PORT", process.env.DB_PORT)),
  user: required("DB_USER", process.env.DB_USER),
  password: process.env.DB_PASSWORD ?? "",
  database: required("DB_NAME", process.env.DB_NAME),
  connectionLimit: 10,
  waitForConnections: true,
  namedPlaceholders: true,
});

export default pool;