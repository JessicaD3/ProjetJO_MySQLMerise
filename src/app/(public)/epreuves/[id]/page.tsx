export const dynamic = "force-dynamic";
import BuyTicketForm from "@/components/tickets/BuyTicketForm";

type EpreuveDetail = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  id_sport: number;
  nom_sport: string;
  id_site: number;
  nom_site: string;
  capacite: number;
};

async function getDetail(id: string): Promise<EpreuveDetail | null> {
  const res = await fetch(`http://localhost:3000/api/epreuves/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return (json?.data ?? null) as EpreuveDetail | null;
}

async function getBilletsCount(id: string): Promise<number> {
  const res = await fetch(`http://localhost:3000/api/epreuves/${id}/billets/count`, { cache: "no-store" });
  if (!res.ok) return 0;
  const json = await res.json().catch(() => null);
  return Number(json?.data?.count ?? 0);
}

export default async function EpreuveDetailPage({ params }: { params: { id: string } }) {
  const detail = await getDetail(params.id);

  if (!detail) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">ÉPREUVE <span>INTROUVABLE</span></h2>
          <p className="section-subtitle">Cette épreuve n’existe pas.</p>
        </div>
      </div>
    );
  }

  const sold = await getBilletsCount(params.id);
  const remaining = Math.max(0, detail.capacite - sold);

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">{detail.nom_epreuve} <span>{detail.nom_sport}</span></h2>
        <p className="section-subtitle">
          🏟️ {detail.nom_site} • 📅 {detail.date_heure}
        </p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 30 }}>
        <p><strong>Billets vendus :</strong> {sold}</p>
        <p><strong>Capacité :</strong> {detail.capacite}</p>
        <p><strong>Billets restants :</strong> {remaining}</p>
      <BuyTicketForm idEpreuve={detail.id_epreuve} defaultPrice={85}/>
      </div>

      <div className="section-header" style={{ marginBottom: 20 }}>
        <h2 className="section-title">Participants & <span>Résultats</span></h2>
        <p className="section-subtitle">
          Prochaine étape : brancher participants/résultats depuis la BDD (endpoints dédiés par épreuve)
        </p>
      </div>
    </div>
  );
}