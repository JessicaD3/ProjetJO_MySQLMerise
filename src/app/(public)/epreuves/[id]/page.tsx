import BuyTicketForm from "@/components/tickets/BuyTicketForm";

export const dynamic = "force-dynamic";

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

function baseUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

async function getDetail(id: string): Promise<EpreuveDetail | null> {
  const res = await fetch(`${baseUrl()}/api/epreuves/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return (json?.data ?? null) as EpreuveDetail | null;
}

async function getBilletsCount(id: string): Promise<number> {
  const res = await fetch(`${baseUrl()}/api/epreuves/${id}/billets/count`, { cache: "no-store" });
  if (!res.ok) return 0;
  const json = await res.json().catch(() => null);
  return Number(json?.data?.count ?? 0);
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EpreuveDetailPage({ params }: PageProps) {
  const { id } = await params; // ✅ IMPORTANT (Next 16.1.6)
  const detail = await getDetail(id);

  if (!detail) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">
            ÉPREUVE <span>INTROUVABLE</span>
          </h2>
          <p className="section-subtitle">Cette épreuve n’existe pas.</p>
        </div>
      </div>
    );
  }

  type Participant = {
  id_athlete: number;
  nom: string;
  prenom: string;
  sexe: string;
  nom_pays: string;
};

async function getParticipants(id: string): Promise<Participant[]> {
  const res = await fetch(`${baseUrl()}/api/epreuves/${id}/participants`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as Participant[];
}

  const sold = await getBilletsCount(id);
  const remaining = Math.max(0, detail.capacite - sold);
  
  const participants = await getParticipants(id);

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">
          {detail.nom_epreuve} <span>{detail.nom_sport}</span>
        </h2>
        <p className="section-subtitle">
          🏟️ {detail.nom_site} • 📅 {detail.date_heure}
        </p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 30 }}>
  <div className="stats-grid" style={{ marginBottom: 0 }}>
    <div className="stat-card">
      <div className="stat-number">{sold}</div>
      <div className="stat-label">Billets vendus</div>
    </div>
    <div className="stat-card">
      <div className="stat-number">{detail.capacite}</div>
      <div className="stat-label">Capacité</div>
    </div>
    <div className="stat-card">
      <div className="stat-number">{remaining}</div>
      <div className="stat-label">Billets restants</div>
    </div>
  </div>

  <div className="progress-bar" style={{ marginTop: 15 }}>
    <div
      className="progress-fill"
      style={{ width: `${Math.min(100, Math.round((sold / Math.max(1, detail.capacite)) * 100))}%` }}
    />
  </div>

  <div style={{ marginTop: 15 }}>
    <BuyTicketForm idEpreuve={detail.id_epreuve} defaultPrice={85} />
  </div>
</div>

            <div className="section-header" style={{ marginBottom: 20 }}>
        <h2 className="section-title">
          Participants <span>inscrits</span>
        </h2>
        <p className="section-subtitle">Liste récupérée depuis la base (participation → athlete → pays)</p>
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 1fr 120px 1fr" }}>
          <div>ID</div>
          <div>Nom</div>
          <div>Prénom</div>
          <div>Sexe</div>
          <div>Pays</div>
        </div>

        {participants.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucun participant pour le moment.</div>
          </div>
        ) : (
          participants.map((a) => (
            <div
              key={a.id_athlete}
              className="medal-row"
              style={{ gridTemplateColumns: "120px 1fr 1fr 120px 1fr" }}
            >
              <div>{a.id_athlete}</div>
              <div>{a.nom}</div>
              <div>{a.prenom}</div>
              <div className="gold">{a.sexe}</div>
              <div>{a.nom_pays}</div>
            </div>
          ))
        )}
      </div>
    </div>

    
  );
}