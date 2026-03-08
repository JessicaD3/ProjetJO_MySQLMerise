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
});

export const POST = handler(async (req) => {
  const user = await requireAuth();
  requireRole(user, ["LECTEUR", "ADMIN"]);

  const body = await validateBody(req, achatBilletSchema);
  const id_utilisateur = user.id_utilisateur;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [capRows] = await conn.query(
      `
      SELECT si.id_site, si.capacite AS capacite
      FROM epreuve e
      JOIN site si ON si.id_site = e.id_site
      WHERE e.id_epreuve = :id_epreuve
      LIMIT 1
      `,
      { id_epreuve: body.id_epreuve }
    );

    const capArr = capRows as any[];
    if (!capArr.length) throw apiError("NOT_FOUND", 404, "Epreuve not found");

    const id_site = Number(capArr[0].id_site);
    const capacite = Number(capArr[0].capacite);

    const [countRows] = await conn.query(
      `SELECT COUNT(*) AS sold FROM billet WHERE id_epreuve = :id_epreuve`,
      { id_epreuve: body.id_epreuve }
    );
    const sold = Number((countRows as any[])[0].sold);

    if (sold >= capacite) throw apiError("CAPACITY_REACHED", 409, "No tickets left for this epreuve");

    const prix_achat = Number(process.env.TICKET_DEFAULT_PRICE ?? 85);
    const num_place = `S${id_site}-E${body.id_epreuve}-${sold + 1}`;

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
        num_place,
        prix_achat,
      }
    );

    const id_billet = (ins as any).insertId;

    await conn.commit();
    return jsonCreated({ id_billet, num_place, prix_achat });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});