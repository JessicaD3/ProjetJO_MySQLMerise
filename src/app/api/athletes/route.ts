import { handler } from "@/lib/http/handler";
import { jsonCreated, jsonOk } from "@/lib/http/response";
import pool from "@/lib/db/pool";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import { validateBody } from "@/lib/validation/validate";
import { z } from "zod";
import * as service from "@/services/athletes.service";

const athleteCreateSchema = z.object({
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  sexe: z.enum(["M", "F"]),
  id_pays: z.number().int().positive(),
});

export const GET = handler(async () => {
  const [rows] = await pool.query(
    `
    SELECT
      a.id_athlete, a.nom, a.prenom, a.sexe, a.id_pays,
      p.nom_pays
    FROM athlete a
    JOIN pays p ON p.id_pays = a.id_pays
    ORDER BY a.nom ASC, a.prenom ASC
    `
  );

  return jsonOk(rows);
});

export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["ADMIN", "ORGANISATEUR"]);

  const body = await validateBody(req, athleteCreateSchema);
  const created = await service.create(body);

  return jsonCreated(created);
});