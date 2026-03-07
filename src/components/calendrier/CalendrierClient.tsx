"use client";

import { useMemo, useState } from "react";

type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  nom_site?: string;
  nom_sport?: string;
};

function parseDateOnly(dt: string) {
  // support "YYYY-MM-DD HH:MM:SS" ou ISO
  const s = dt.includes("T") ? dt : dt.replace(" ", "T");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export default function CalendrierClient({ epreuves }: { epreuves: Epreuve[] }) {
  // février 2026 par défaut (maquette)
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1); // 0=janv, 1=fév
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<number, Epreuve[]>();
    epreuves.forEach((e) => {
      const d = parseDateOnly(e.date_heure);
      if (!d) return;
      if (d.getFullYear() !== year || d.getMonth() !== month) return;
      const day = d.getDate();
      map.set(day, [...(map.get(day) ?? []), e]);
    });
    // tri par heure
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.date_heure > b.date_heure ? 1 : -1));
      map.set(k, arr);
    }
    return map;
  }, [epreuves, year, month]);

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);

  function changeMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    setSelectedDay(null);
  }

  const monthLabel = useMemo(() => {
    const d = new Date(year, month, 1);
    return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  }, [year, month]);

  const selectedEvents = selectedDay ? (byDay.get(selectedDay) ?? []) : [];

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">
          CALENDRIER <span>DES ÉPREUVES</span>
        </h2>
        <p className="section-subtitle">Calendrier alimenté par la base (EPREUVE.date_heure)</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <h3 style={{ textTransform: "capitalize" }}>{monthLabel}</h3>
          <div className="calendar-nav">
            <button onClick={() => changeMonth(-1)}>←</button>
            <button onClick={() => changeMonth(1)}>→</button>
          </div>
        </div>

        <div className="calendar-grid">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
            <div key={d} style={{ textAlign: "center", color: "var(--gold)", fontWeight: 600 }}>
              {d}
            </div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const hasEvent = byDay.has(day);
            return (
              <div
                key={day}
                className={`calendar-day ${hasEvent ? "has-event" : ""}`}
                onClick={() => setSelectedDay(day)}
                style={{ cursor: "pointer" }}
              >
                {day}
                {hasEvent ? <span className="event-indicator"></span> : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste du jour */}
      {selectedDay !== null ? (
        <div style={{ marginTop: 30 }}>
          <div className="section-header" style={{ marginBottom: 20 }}>
            <h2 className="section-title">
              Épreuves du <span>{selectedDay}</span>
            </h2>
          </div>

          <div className="medals-table">
            <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 1fr 1fr 140px" }}>
              <div>ID</div>
              <div>Épreuve</div>
              <div>Sport</div>
              <div>Site</div>
              <div>Détail</div>
            </div>

            {selectedEvents.length === 0 ? (
              <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
                <div style={{ textAlign: "center" }}>Aucune épreuve ce jour.</div>
              </div>
            ) : (
              selectedEvents.map((e) => (
                <div
                  key={e.id_epreuve}
                  className="medal-row"
                  style={{ gridTemplateColumns: "120px 1fr 1fr 1fr 140px" }}
                >
                  <div>{e.id_epreuve}</div>
                  <div>{e.nom_epreuve}</div>
                  <div>{e.nom_sport ?? "—"}</div>
                  <div>{e.nom_site ?? "—"}</div>
                  <div>
                    <a className="filter-btn" href={`/epreuves/${e.id_epreuve}`}>Voir</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}