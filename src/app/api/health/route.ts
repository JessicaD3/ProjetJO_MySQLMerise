import pool from "@/lib/db/pool";
import { handler } from "@/lib/http/handler";
import { jsonOk, jsonError } from "@/lib/http/response";


// Route GET /api/health pour vérifier la santé de l'API et la connexion à la base de données
export const GET = handler(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    return jsonOk({
      status: "ok",
      db: "ok",
      ping: rows,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("[DB_ERROR]", e?.message ?? e);
    return jsonError(503, "DB_UNAVAILABLE", "Database connection failed");
  }
});