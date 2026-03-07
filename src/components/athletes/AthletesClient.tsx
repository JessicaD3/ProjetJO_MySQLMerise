"use client";

import { useMemo, useState } from "react";

type AthleteRow = {
  id_athlete: number;
  nom: string;
  prenom: string;
  sexe: string;
  id_pays: number;
  nom_pays: string;
};

export default function AthletesClient({ athletes }: { athletes: AthleteRow[] }) {
  const [filterPays, setFilterPays] = useState<number | "all">("all");

  const availablePays = useMemo(() => {
    const map = new Map<number, string>();
    athletes.forEach((a) => map.set(a.id_pays, a.nom_pays));
    return Array.from(map.entries()).map(([id_pays, nom_pays]) => ({ id_pays, nom_pays }));
  }, [athletes]);

  const filtered = useMemo(() => {
    if (filterPays === "all") return athletes;
    return athletes.filter((a) => a.id_pays === filterPays);
  }, [athletes, filterPays]);

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">
          LES <span>ATHLÈTES</span>
        </h2>
        <p className="section-subtitle">Retrouvez les athlètes engagés aux Jeux</p>
      </div>

      <div className="filters">
        <button className={`filter-btn ${filterPays === "all" ? "active" : ""}`} onClick={() => setFilterPays("all")}>
          Tous
        </button>
        {availablePays.map((p) => (
          <button
            key={p.id_pays}
            className={`filter-btn ${filterPays === p.id_pays ? "active" : ""}`}
            onClick={() => setFilterPays(p.id_pays)}
          >
            {p.nom_pays}
          </button>
        ))}
      </div>

      <div className="athletes-grid">
        {filtered.length === 0 ? (
          <div style={{ color: "var(--text-soft)", textAlign: "center" }}>
            Aucun athlète à afficher.
          </div>
        ) : (
          filtered.map((a) => (
            <div key={a.id_athlete} className="athlete-card">
              <div
                className="athlete-image"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&w=1350&q=80')",
                }}
              />
              <div className="athlete-info">
                <h3 className="athlete-name">{a.nom} {a.prenom}</h3>
                <p className="athlete-country">{a.nom_pays}</p>
                <div className="athlete-stats">
                  <span>👤 {a.sexe}</span>
                  <span>🆔 {a.id_athlete}</span>
                </div>
                <p className="athlete-bio">Profil officiel — {a.nom_pays}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}