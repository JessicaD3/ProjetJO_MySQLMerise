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

function parseDate(dt: string) {
  const s = dt.includes("T") ? dt : dt.replace(" ", "T");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatDateFr(dt: string) {
  const d = parseDate(dt);
  if (!d) return dt;

  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatHourFr(dt: string) {
  const d = parseDate(dt);
  if (!d) return "--:--";

  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSportEmoji(sport?: string) {
  const s = (sport ?? "").toLowerCase();

  if (s.includes("ski")) return "🎿";
  if (s.includes("hockey")) return "🏒";
  if (s.includes("patin")) return "⛸️";
  if (s.includes("biathlon")) return "🎯";
  if (s.includes("curling")) return "🥌";
  if (s.includes("luge")) return "🛷";
  return "🏔️";
}

function getSportClass(sport?: string) {
  const s = (sport ?? "").toLowerCase();

  if (s.includes("ski")) return "ski";
  if (s.includes("hockey")) return "hockey";
  if (s.includes("patin")) return "patinage";
  if (s.includes("biathlon")) return "biathlon";
  if (s.includes("curling")) return "curling";
  return "default";
}

export default function TicketsClient({ stats }: { stats: TicketStat[] }) {
  const sorted = [...stats].sort((a, b) => {
    const da = parseDate(a.date_heure)?.getTime() ?? 0;
    const db = parseDate(b.date_heure)?.getTime() ?? 0;
    return da - db;
  });

  return (
    <section className="official-tickets-shell">
      <div className="official-tickets-page">
        <div className="official-tickets-hero">
          <div className="official-tickets-hero-left">
            <p className="official-tickets-kicker">Billetterie officielle</p>
            <h1 className="official-tickets-title">
              Billets <span>Milano Cortina 2026</span>
            </h1>
            <p className="official-tickets-subtitle">
              Réservez vos places pour les épreuves olympiques d’hiver et accédez
              directement aux pages d’achat officielles.
            </p>
          </div>

          <div className="official-tickets-hero-badge">
            <span className="official-tickets-hero-badge-icon">🎟️</span>
            <div>
              <strong>{sorted.length}</strong>
              <p>épreuve(s) disponible(s)</p>
            </div>
          </div>
        </div>

        <div className="official-tickets-livebar">
          <div className="official-tickets-live-label">Info billetterie</div>
          <div className="official-tickets-live-track">
            <span>Réservation sécurisée</span>
            <span>•</span>
            <span>Billets liés aux épreuves officielles</span>
            <span>•</span>
            <span>Accès rapide aux fiches épreuves</span>
          </div>
        </div>

        <div className="official-tickets-grid">
          {sorted.length === 0 ? (
            <div className="official-ticket-empty">
              Aucun billet officiel disponible pour le moment.
            </div>
          ) : (
            sorted.map((t) => {
              const soldOut = t.remaining <= 0;
              const sportClass = getSportClass(t.nom_sport);

              return (
                <article
                  key={t.id_epreuve}
                  className={`official-ticket-card-grid ${soldOut ? "sold-out" : ""}`}
                >
                  <div className="official-ticket-card-top">
                    <div className={`official-ticket-sport-tag ${sportClass}`}>
                      <span>{getSportEmoji(t.nom_sport)}</span>
                      <span>{t.nom_sport}</span>
                    </div>

                    <div
                      className={`official-ticket-status ${
                        soldOut ? "sold-out" : "available"
                      }`}
                    >
                      {soldOut ? "Complet" : "Disponible"}
                    </div>
                  </div>

                  <h3 className="official-ticket-card-title">{t.nom_epreuve}</h3>

                  <p className="official-ticket-card-sub">
                    {t.nom_site}
                  </p>

                  <div className="official-ticket-card-meta">
                    <div className="official-ticket-meta-item">
                      <span>📅</span>
                      <span>{formatDateFr(t.date_heure)}</span>
                    </div>
                    <div className="official-ticket-meta-item">
                      <span>⏰</span>
                      <span>{formatHourFr(t.date_heure)}</span>
                    </div>
                    <div className="official-ticket-meta-item">
                      <span>📍</span>
                      <span>{t.nom_site}</span>
                    </div>
                  </div>

                  <div className="official-ticket-card-footer">
                    <div className="official-ticket-remaining">
                      {soldOut ? (
                        <span className="remaining-sold-out">Plus de place disponible</span>
                      ) : (
                        <>
                          <strong>{t.remaining}</strong>
                          <span>place(s) disponible(s)</span>
                        </>
                      )}
                    </div>

                    <a
                      className={`official-ticket-buy-btn ${soldOut ? "disabled" : ""}`}
                      href={soldOut ? "#" : `/epreuves/${t.id_epreuve}`}
                      aria-disabled={soldOut}
                    >
                      {soldOut ? "Événement complet" : "Acheter"}
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>

  
      </div>
    </section>
  );
}