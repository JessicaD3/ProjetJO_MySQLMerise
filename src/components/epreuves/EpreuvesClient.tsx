"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type EpreuveRow = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  id_sport: number;
  nom_sport: string;
  id_site: number;
  nom_site: string;
};

function formatDateFR(dt: string) {
  const d = new Date(dt.replace(" ", "T"));
  return Number.isNaN(d.getTime())
    ? dt
    : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function EpreuvesClient({
  initialEpreuves = [],
}: {
  initialEpreuves?: EpreuveRow[];
}) {
  const sports = useMemo(() => {
    const map = new Map<number, string>();
    initialEpreuves.forEach((e) => map.set(e.id_sport, e.nom_sport));
    return Array.from(map.entries()).map(([id, nom]) => ({ id, nom }));
  }, [initialEpreuves]);

  const sites = useMemo(() => {
    const map = new Map<number, string>();
    initialEpreuves.forEach((e) => map.set(e.id_site, e.nom_site));
    return Array.from(map.entries()).map(([id, nom]) => ({ id, nom }));
  }, [initialEpreuves]);

  const [sportFilter, setSportFilter] = useState<number | "all">("all");
  const [siteFilter, setSiteFilter] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    return initialEpreuves.filter((e) => {
      if (sportFilter !== "all" && e.id_sport !== sportFilter) return false;
      if (siteFilter !== "all" && e.id_site !== siteFilter) return false;
      return true;
    });
  }, [initialEpreuves, sportFilter, siteFilter]);

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">
          TOUTES LES <span>ÉPREUVES</span>
        </h2>
        <p className="section-subtitle">Découvrez le programme complet des compétitions</p>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${sportFilter === "all" ? "active" : ""}`}
          onClick={() => setSportFilter("all")}
        >
          Tous sports
        </button>
        {sports.map((s) => (
          <button
            key={s.id}
            className={`filter-btn ${sportFilter === s.id ? "active" : ""}`}
            onClick={() => setSportFilter(s.id)}
          >
            {s.nom}
          </button>
        ))}

        <button
          className={`filter-btn ${siteFilter === "all" ? "active" : ""}`}
          onClick={() => setSiteFilter("all")}
        >
          Tous sites
        </button>
        {sites.map((s) => (
          <button
            key={s.id}
            className={`filter-btn ${siteFilter === s.id ? "active" : ""}`}
            onClick={() => setSiteFilter(s.id)}
          >
            {s.nom}
          </button>
        ))}
      </div>

      <div className="sports-grid">
        {filtered.length === 0 ? (
          <div style={{ color: "var(--text-soft)", textAlign: "center" }}>
            Aucune épreuve à afficher.
          </div>
        ) : (
          filtered.map((e) => (
            <Link
              key={e.id_epreuve}
              href={`/epreuves/${e.id_epreuve}`}
              className="sport-card"
            >
              <div
                className="sport-image"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
                }}
              />
              <div className="sport-content">
                <div className="sport-category">{e.nom_sport}</div>
                <h3 className="sport-title">{e.nom_epreuve}</h3>
                <div className="sport-details">
                  <span>📅 {formatDateFR(e.date_heure)}</span>
                  <span>🏟️ {e.nom_site}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}