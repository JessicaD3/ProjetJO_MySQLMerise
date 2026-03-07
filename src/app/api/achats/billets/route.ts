import { handler } from "@/lib/http/handler";
import { jsonCreated } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { apiError } from "@/lib/http/errors";
import pool from "@/lib/db/pool";
import { requireAuth } from "@/lib/auth/session";
import { requireRole } from "@/lib/auth/rbac";
import { z } from "zod";

const achatBilletSchema = z.object({
  id_epreuve: z.number().int().positive(),
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  num_place: z.string().min(1).max(50),
  prix_achat: z.number().nonnegative(),
});

export const POST = handler(async (req) => {
  const user = await requireAuth();
  // LECTEUR = spectateur (tu peux garder ADMIN aussi pour test)
  requireRole(user, ["LECTEUR", "ADMIN"]);

  const body = await validateBody(req, achatBilletSchema);
  const id_utilisateur = user.id_utilisateur;

  // Contrôle capacité : billets vendus <= capacité site de l'épreuve
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) capacité de l’épreuve
    const [capRows] = await conn.query(
      `
      SELECT si.capacite AS capacite
      FROM epreuve e
      JOIN site si ON si.id_site = e.id_site
      WHERE e.id_epreuve = :id_epreuve
      LIMIT 1
      `,
      { id_epreuve: body.id_epreuve }
    );
    const capArr = capRows as any[];
    if (!capArr.length) throw apiError("NOT_FOUND", 404, "Epreuve not found");
    const capacite = Number(capArr[0].capacite);

    // 2) count billets
    const [countRows] = await conn.query(
      `SELECT COUNT(*) AS sold FROM billet WHERE id_epreuve = :id_epreuve`,
      { id_epreuve: body.id_epreuve }
    );
    const sold = Number((countRows as any[])[0].sold);

    if (sold >= capacite) throw apiError("CAPACITY_REACHED", 409, "No tickets left for this epreuve");

    // 3) insert billet
    const [ins] = await conn.query(
      `
      INSERT INTO billet (id_epreuve, id_utilisateur, nom, prenom, date_achat, num_place, prix_achat)
      VALUES (:id_epreuve, :id_utilisateur, :nom, :prenom, NOW(), :num_place, :prix_achat)
      `,
      {
        id_epreuve: body.id_epreuve,
        id_utilisateur,
        nom: body.nom,
        prenom: body.prenom,
        num_place: body.num_place,
        prix_achat: body.prix_achat,
      }
    );

    const id_billet = (ins as any).insertId;
    await conn.commit();

    return jsonCreated({ id_billet });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});