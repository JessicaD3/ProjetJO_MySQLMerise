// src/app/(public)/billets/page.tsx
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import pool from "@/lib/db/pool";

export const dynamic = "force-dynamic";

type Billet = {
  id_billet: number;
  id_epreuve: number;
  nom: string;
  prenom: string;
  date_achat: string;
  num_place: string;
  prix_achat: number;
};

export default async function MesBilletsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.nom_role !== "LECTEUR") redirect("/admin");

  const [rows] = await pool.query(
    `
    SELECT id_billet, id_epreuve, nom, prenom, date_achat, num_place, prix_achat
    FROM billet
    WHERE id_utilisateur = :id_utilisateur
    ORDER BY date_achat DESC
    `,
    { id_utilisateur: user.id_utilisateur }
  );

  const billets = rows as Billet[];

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">
          MES <span>BILLETS</span>
        </h2>
        <p className="section-subtitle">Historique de vos achats (factures)</p>
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "100px 160px 1fr 160px 140px 140px" }}>
          <div>ID</div>
          <div>Date</div>
          <div>Bénéficiaire</div>
          <div>Place</div>
          <div>Prix</div>
          <div>Détail</div>
        </div>

        {billets.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>
              Aucun billet acheté pour le moment.
            </div>
          </div>
        ) : (
          billets.map((b) => (
            <div
              key={b.id_billet}
              className="medal-row"
              style={{ gridTemplateColumns: "100px 160px 1fr 160px 140px 140px" }}
            >
              <div>{b.id_billet}</div>
              <div>{b.date_achat}</div>
              <div>{b.nom} {b.prenom}</div>
              <div>{b.num_place}</div>
              <div className="gold">{b.prix_achat}€</div>
              <div>
                <a className="filter-btn" href={`/billets/${b.id_billet}`}>Voir</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}