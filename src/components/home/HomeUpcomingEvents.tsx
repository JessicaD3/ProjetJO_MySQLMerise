type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string | Date;
  nom_sport?: string;
  nom_site?: string;
};

function parseDate(dt: string | Date) {
  const d =
    dt instanceof Date
      ? dt
      : new Date(dt.includes("T") ? dt : dt.replace(" ", "T"));

  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatDateFr(dt: string | Date) {
  const d = parseDate(dt);
  if (!d) return String(dt);

  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatHourFr(dt: string | Date) {
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

export default function HomeUpcomingEvents({
  epreuves,
}: {
  epreuves: Epreuve[];
}) {
  return (
    <section className="home-upcoming-shell">
      <div className="home-upcoming-wrap">
        <div className="home-upcoming-head">
          <div>
            <p className="home-upcoming-kicker">Programme officiel</p>
            <h2 className="home-upcoming-title">
              À <span>venir</span>
            </h2>
            <p className="home-upcoming-subtitle">
              Les prochaines compétitions programmées dans le système officiel
              des Jeux.
            </p>
          </div>

          <a className="home-upcoming-link" href="/calendrier">
            Voir tout le calendrier
          </a>
        </div>

        <div className="home-upcoming-grid">
          {epreuves.length === 0 ? (
            <div className="home-upcoming-empty">
              Aucune épreuve à venir pour le moment.
            </div>
          ) : (
            epreuves.map((e) => (
              <article key={e.id_epreuve} className="home-upcoming-card">
                <div className="home-upcoming-card-top">
                  <div className="home-upcoming-sport-chip">
                    <span>{getSportEmoji(e.nom_sport)}</span>
                    <span>{e.nom_sport ?? "Sport"}</span>
                  </div>

                  <div className="home-upcoming-time">
                    {formatHourFr(e.date_heure)}
                  </div>
                </div>

                <h3 className="home-upcoming-card-title">{e.nom_epreuve}</h3>

                <div className="home-upcoming-meta">
                  <div>📅 {formatDateFr(e.date_heure)}</div>
                  <div>📍 {e.nom_site ?? "Site à confirmer"}</div>
                </div>

                <div className="home-upcoming-actions">
                  <a
                    className="home-upcoming-btn subtle"
                    href={`/epreuves/${e.id_epreuve}`}
                  >
                    Voir
                  </a>
                  <a
                    className="home-upcoming-btn solid"
                    href={`/epreuves/${e.id_epreuve}`}
                  >
                    Réserver
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}