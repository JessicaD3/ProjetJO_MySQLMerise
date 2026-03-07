// src/app/(public)/billets/[id]/page.tsx
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import pool from "@/lib/db/pool";
import { apiError } from "@/lib/http/errors";

export const dynamic = "force-dynamic";

type Billet = {
  id_billet: number;
  id_epreuve: number;
  id_utilisateur: number;
  nom: string;
  prenom: string;
  date_achat: string;
  num_place: string;
  prix_achat: number;
};

export default async function BilletDetailPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.nom_role !== "LECTEUR") redirect("/admin");

  const id_billet = Number(params.id);
  if (!params.id || Number.isNaN(id_billet) || id_billet <= 0) {
    throw apiError("BAD_REQUEST", 400, "Invalid id");
  }

  const [rows] = await pool.query(
    `SELECT * FROM billet WHERE id_billet = :id_billet LIMIT 1`,
    { id_billet }
  );

  const arr = rows as Billet[];
  if (!arr.length) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">FACTURE <span>INTROUVABLE</span></h2>
          <p className="section-subtitle">Ce billet n’existe pas.</p>
        </div>
      </div>
    );
  }

  const billet = arr[0];
  if (billet.id_utilisateur !== user.id_utilisateur) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">ACCÈS <span>REFUSÉ</span></h2>
          <p className="section-subtitle">Ce billet ne vous appartient pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: 140, maxWidth: 900 }}>
      <div className="section-header">
        <h2 className="section-title">
          FACTURE <span>#{billet.id_billet}</span>
        </h2>
        <p className="section-subtitle">Détail de votre achat</p>
      </div>

      <div className="medals-table" style={{ padding: 25 }}>
        <p><strong>Date d’achat :</strong> {billet.date_achat}</p>
        <p><strong>Bénéficiaire :</strong> {billet.nom} {billet.prenom}</p>
        <p>
          <strong>Épreuve :</strong> #{billet.id_epreuve}{" "}
          <a className="filter-btn" href={`/epreuves/${billet.id_epreuve}`}>Voir l’épreuve</a>
        </p>
        <p><strong>Place :</strong> {billet.num_place}</p>
        <p><strong>Prix :</strong> <span className="gold">{billet.prix_achat}€</span></p>
      </div>

      <div className="filters" style={{ marginTop: 20 }}>
        <a className="filter-btn" href="/billets">← Retour mes billets</a>
      </div>
    </div>
  );
}