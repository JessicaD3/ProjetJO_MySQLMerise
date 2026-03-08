"use client";

import { useMemo, useState } from "react";

type SportCard = {
  id_sport: number;
  nom_sport: string;
  nb_epreuves: number;
  prochaine_date?: string | Date | null;
};

function parseDate(dt?: string | Date | null) {
  if (!dt) return null;

  const d =
    dt instanceof Date
      ? dt
      : new Date(dt.includes("T") ? dt : dt.replace(" ", "T"));

  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatDateFr(dt?: string | null) {
  const d = parseDate(dt);
  if (!d) return "Date à confirmer";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getSportEmoji(name: string) {
  const s = name.toLowerCase();
  if (s.includes("ski")) return "🎿";
  if (s.includes("hockey")) return "🏒";
  if (s.includes("patin")) return "⛸️";
  if (s.includes("biathlon")) return "🎯";
  if (s.includes("curling")) return "🥌";
  if (s.includes("luge")) return "🛷";
  if (s.includes("bobsleigh")) return "🛷";
  return "🏔️";
}

function getSportTone(name: string) {
  const s = name.toLowerCase();
  if (s.includes("ski")) return "ski";
  if (s.includes("hockey")) return "hockey";
  if (s.includes("patin")) return "patinage";
  if (s.includes("biathlon")) return "biathlon";
  if (s.includes("curling")) return "curling";
  return "default";
}

export default function SportsClient({ sports }: { sports: SportCard[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sports;
    return sports.filter((s) => s.nom_sport.toLowerCase().includes(term));
  }, [sports, search]);

  return (
    <section className="sports-premium-shell">
      <div className="sports-premium-page">
        <div className="sports-premium-hero">
          <div className="sports-premium-hero-left">
            <p className="sports-premium-kicker">Programme officiel</p>
            <h1 className="sports-premium-title">
              Tous les <span>sports</span>
            </h1>
            <p className="sports-premium-subtitle">
              Découvrez les disciplines présentes aux Jeux et accédez ensuite
              aux épreuves rattachées pour consulter les détails et réserver.
            </p>
          </div>

          <div className="sports-premium-badge">
            <span className="sports-premium-badge-icon">🏅</span>
            <div>
              <strong>{filtered.length}</strong>
              <p>sport(s)</p>
            </div>
          </div>
        </div>

        <div className="sports-premium-toolbar">
          <div className="sports-search-box">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Rechercher un sport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="sports-premium-grid">
          {filtered.length === 0 ? (
            <div className="sports-premium-empty">
              Aucun sport ne correspond à votre recherche.
            </div>
          ) : (
            filtered.map((sport) => {
              const tone = getSportTone(sport.nom_sport);

              return (
                <article
                  key={sport.id_sport}
                  className={`sport-premium-card ${tone}`}
                >
                  <div className="sport-premium-card-top">
                    <div className={`sport-premium-chip ${tone}`}>
                      <span>{getSportEmoji(sport.nom_sport)}</span>
                      <span>{sport.nom_sport}</span>
                    </div>
                  </div>

                  <h3 className="sport-premium-title-card">{sport.nom_sport}</h3>

                  <div className="sport-premium-meta">
                    <div className="sport-premium-stat">
                      <strong>{sport.nb_epreuves}</strong>
                      <span>épreuve(s)</span>
                    </div>
                    <div className="sport-premium-next">
                      <span>Prochaine date</span>
                      <strong>{formatDateFr(sport.prochaine_date)}</strong>
                    </div>
                  </div>

                  <a
                    className="sport-premium-btn"
                    href={`/sports/${sport.id_sport}`}
                  >
                    Voir les épreuves
                  </a>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}