import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { requireAuth } from "@/lib/auth/session";
import pool from "@/lib/db/pool";

export const GET = handler(async () => {
  const user = await requireAuth();

  const [aggRows] = await pool.query(
    `
    SELECT
      COUNT(*) AS ticketsCount,
      COALESCE(SUM(prix_achat), 0) AS totalSpent
    FROM billet
    WHERE id_utilisateur = :id_utilisateur
    `,
    { id_utilisateur: user.id_utilisateur }
  );
  const agg = (aggRows as any[])[0];

  const [upcomingRows] = await pool.query(
    `
    SELECT COUNT(*) AS upcomingEvents
    FROM billet b
    JOIN epreuve e ON e.id_epreuve = b.id_epreuve
    WHERE b.id_utilisateur = :id_utilisateur
      AND e.date_heure > NOW()
    `,
    { id_utilisateur: user.id_utilisateur }
  );

  const [recentInvoices] = await pool.query(
    `
    SELECT b.*
    FROM billet b
    WHERE b.id_utilisateur = :id_utilisateur
    ORDER BY b.date_achat DESC
    LIMIT 5
    `,
    { id_utilisateur: user.id_utilisateur }
  );

  const [upcomingTickets] = await pool.query(
    `
    SELECT
      b.id_billet, b.nom, b.prenom, b.num_place, b.prix_achat, b.date_achat,
      e.id_epreuve, e.nom_epreuve, e.date_heure
    FROM billet b
    JOIN epreuve e ON e.id_epreuve = b.id_epreuve
    WHERE b.id_utilisateur = :id_utilisateur
      AND e.date_heure > NOW()
    ORDER BY e.date_heure ASC
    LIMIT 5
    `,
    { id_utilisateur: user.id_utilisateur }
  );

  return jsonOk({
    ticketsCount: Number(agg.ticketsCount),
    totalSpent: Number(agg.totalSpent),
    upcomingEvents: Number((upcomingRows as any[])[0].upcomingEvents),
    recentInvoices,
    upcomingTickets,
  });
});