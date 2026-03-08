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

type Participant = {
  id_athlete: number;
  nom: string;
  prenom: string;
  sexe: string;
  id_pays: number;
  nom_pays: string;
};

type TicketStat = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  nom_sport: string;
  nom_site: string;
  capacite: number;
  sold: number;
  remaining: number;
};

async function getDetail(id: string): Promise<EpreuveDetail | null> {
  const res = await fetch(`http://localhost:3000/api/epreuves/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return (json?.data ?? null) as EpreuveDetail | null;
}

async function getTicketStatsForEpreuve(id: string): Promise<TicketStat | null> {
  const res = await fetch(`http://localhost:3000/api/epreuves/billets/stats`, {
    cache: "no-store",
  });
  if (!res.ok) return null;

  const json = await res.json().catch(() => null);
  const rows = (json?.data ?? []) as TicketStat[];
  return rows.find((r) => Number(r.id_epreuve) === Number(id)) ?? null;
}

async function getParticipants(id: string): Promise<Participant[]> {
  const res = await fetch(`http://localhost:3000/api/epreuves/${id}/participants`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as Participant[];
}

function formatDateFr(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function EpreuveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [detail, stats, participants] = await Promise.all([
    getDetail(id),
    getTicketStatsForEpreuve(id),
    getParticipants(id),
  ]);

  if (!detail) {
    return (
      <div className="section" style={{ paddingTop: 120 }}>
        <div className="section-header">
          <h2 className="section-title">
            ÉPREUVE <span>INTROUVABLE</span>
          </h2>
          <p className="section-subtitle">Cette épreuve n’existe pas.</p>
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, Number(stats?.remaining ?? detail.capacite));
  const isSoldOut = remaining <= 0;
  const eventDate = formatDateFr(detail.date_heure);

  return (
    <section className="official-ticket-shell">
      <div className="official-ticket-card">
        <div className="official-ticket-grid">
          <div className="official-ticket-main">
            <div className="official-event-header">
              <span className="official-event-badge">{detail.nom_sport}</span>

              <h1 className="official-event-title">
                {detail.nom_epreuve}
                <span>{detail.nom_site}</span>
              </h1>

              <div className="official-event-meta">
                <div className="official-event-meta-item">
                  <strong>📅</strong>
                  <span>{eventDate}</span>
                </div>
                <div className="official-event-meta-item">
                  <strong>🏟️</strong>
                  <span>{detail.nom_site}</span>
                </div>
                <div className="official-event-meta-item">
                  <strong>🎟️</strong>
                  <span>{isSoldOut ? "Événement complet" : "Billetterie officielle"}</span>
                </div>
              </div>
            </div>

            <div className="official-ticket-stats">
              <div className="official-stat-block">
                <div className="official-stat-number">{remaining}</div>
                <div className="official-stat-label">Places disponibles</div>
              </div>

              <div className="official-stat-block">
                <div className="official-stat-number">{participants.length}</div>
                <div className="official-stat-label">Athlètes inscrits</div>
              </div>

              <div className="official-stat-block">
                <div className="official-stat-number">85 €</div>
                <div className="official-stat-label">Tarif officiel</div>
              </div>
            </div>

            <BuyTicketForm
              idEpreuve={detail.id_epreuve}
              defaultPrice={85}
              eventName={detail.nom_epreuve}
              sportName={detail.nom_sport}
              venueName={detail.nom_site}
              remaining={remaining}
              soldOut={isSoldOut}
            />

            <div className="official-info-note">
              <span>ℹ️</span>
              <p>
                Les places sont attribuées automatiquement
                lors de l’achat.
              </p>
            </div>
          </div>

          <aside className="official-ticket-side">
            <div className="official-side-top">
              <p className="official-side-kicker">Liste officielle</p>
              <h2 className="official-side-title">Participants inscrits</h2>
              <p className="official-side-subtitle">
                Athlètes actuellement rattachés à cette épreuve.
              </p>
            </div>

            <div className="official-participants-list">
              {participants.length === 0 ? (
                <div className="official-empty-state">
                  Aucun participant enregistré pour le moment.
                </div>
              ) : (
                participants.map((p, index) => (
                  <div key={p.id_athlete} className="official-participant-row">
                    <div className="official-participant-rank">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="official-participant-body">
                      <div className="official-participant-name">
                        {p.prenom} {p.nom}
                      </div>
                      <div className="official-participant-meta">
                        {p.nom_pays} • {p.sexe}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="official-side-footer">
              <div className="official-side-footer-card">
                <strong>Billetterie sécurisée</strong>
                <span>
                  Achat rattaché à votre compte utilisateur et à l’épreuve sélectionnée.
                </span>
              </div>

              <div className="official-fun-weather">
  <div className="official-fun-weather-badge">Météo station</div>
  <div className="official-fun-weather-main">
    <span className="official-fun-weather-temp">-6°C</span>
    <span className="official-fun-weather-text">
      Neige légère · Vent faible
    </span>
  </div>
</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}