"use client";

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

function formatDate(dt: string) {
  // "YYYY-MM-DD HH:MM:SS" ou ISO
  const s = dt.includes("T") ? dt : dt.replace(" ", "T");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

export default function TicketsClient({ stats }: { stats: TicketStat[] }) {
  return (
    <div className="section" style={{ paddingTop: 50 }}>
      <div className="tickets-section">
        <div className="section-header">
          <h2 className="section-title">
            BILLETS <span>OFFICIELS</span>
          </h2>
          <p className="section-subtitle">
            Réservez vos places pour vivre les moments forts des Jeux.
          </p>
        </div>

        <div className="tickets-grid">
          {stats.length === 0 ? (
            <p style={{ color: "var(--text-soft)" }}>Aucune épreuve disponible.</p>
          ) : (
            stats.map((t) => (
              <div key={t.id_epreuve} className="ticket-card">
                <div className="ticket-category">{t.nom_sport}</div>
                <div className="ticket-event">{t.nom_epreuve}</div>

                <div style={{ color: "var(--text-soft)", marginBottom: 10 }}>
                  📍 {t.nom_site}
                  <br />
                  📅 {formatDate(t.date_heure)}
                </div>

                    <div style={{ marginBottom: 14 }}>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(100, Math.round((t.sold / Math.max(1, t.capacite)) * 100))}%`,
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", color: "var(--text-soft)" }}>
                      <span>
                        Places disponibles : <strong style={{ color: "var(--gold)" }}>{t.remaining}</strong>
                      </span>
                    </div>
                  </div>

                <a className="btn-ticket" href={`/epreuves/${t.id_epreuve}`}>
                  Acheter un billet
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}