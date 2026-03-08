"use client";

import { useMemo, useState } from "react";

type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  nom_site?: string;
  nom_sport?: string;
};

type CalendarCell = {
  day: number | null;
  isCurrentMonth: boolean;
  date: Date | null;
};

function parseDateOnly(dt: string) {
  const s = dt.includes("T") ? dt : dt.replace(" ", "T");
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatHour(dt: string) {
  const d = parseDateOnly(dt);
  if (!d) return "—";
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getSportClass(sport?: string) {
  const value = (sport ?? "").toLowerCase();

  if (value.includes("ski")) return "ski";
  if (value.includes("hockey")) return "hockey";
  if (value.includes("patin")) return "patinage";
  if (value.includes("biathlon")) return "biathlon";
  if (value.includes("curling")) return "curling";
  return "default";
}

export default function CalendrierClient({ epreuves }: { epreuves: Epreuve[] }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
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

    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => {
        const da = parseDateOnly(a.date_heure)?.getTime() ?? 0;
        const db = parseDateOnly(b.date_heure)?.getTime() ?? 0;
        return da - db;
      });
      map.set(k, arr);
    }

    return map;
  }, [epreuves, year, month]);

  const monthLabel = useMemo(() => {
    const d = new Date(year, month, 1);
    return d.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  }, [year, month]);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let startWeekday = firstDay.getDay();
    if (startWeekday === 0) startWeekday = 7;

    const cells: CalendarCell[] = [];

    for (let i = 1; i < startWeekday; i += 1) {
      cells.push({
        day: null,
        isCurrentMonth: false,
        date: null,
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push({
        day: null,
        isCurrentMonth: false,
        date: null,
      });
    }

    return cells;
  }, [year, month]);

  const selectedEvents = selectedDay ? (byDay.get(selectedDay) ?? []) : [];
  const selectedDate =
    selectedDay !== null ? new Date(year, month, selectedDay) : null;

  function changeMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    setSelectedDay(null);
  }

  return (
    <section className="calendar-premium-shell">
      <div className="calendar-premium-hero">
        <div className="calendar-premium-hero-left">
          <p className="calendar-premium-kicker">Programme officiel</p>
          <h1 className="calendar-premium-title">
            Calendrier <span>des épreuves</span>
          </h1>
          <p className="calendar-premium-subtitle">
            Explorez le programme mois par mois et consultez les compétitions
            prévues chaque jour.
          </p>
        </div>

        <div className="calendar-premium-toolbar">
          <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
            ←
          </button>
          <div className="calendar-month-pill" style={{ textTransform: "capitalize" }}>
            {monthLabel}
          </div>
          <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>
            →
          </button>
        </div>
      </div>

      <div className="calendar-premium-layout">
        <div className="calendar-premium-card">
          <div className="calendar-weekdays">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div key={d} className="calendar-weekday-cell">
                {d}
              </div>
            ))}
          </div>

          <div className="calendar-month-grid">
            {calendarCells.map((cell, index) => {
              const dayEvents = cell.day ? byDay.get(cell.day) ?? [] : [];
              const isSelected = selectedDay === cell.day;

              return (
                <div
                  key={`${cell.day ?? "empty"}-${index}`}
                  className={[
                    "calendar-month-cell",
                    !cell.isCurrentMonth ? "is-empty" : "",
                    isSelected ? "is-selected" : "",
                    dayEvents.length > 0 ? "has-events" : "",
                  ].join(" ")}
                  onClick={() => {
                    if (cell.day) setSelectedDay(cell.day);
                  }}
                >
                  {cell.day ? (
                    <>
                      <div className="calendar-cell-top">
                        <span className="calendar-day-number">{cell.day}</span>
                        {dayEvents.length > 0 ? (
                          <span className="calendar-day-dot" />
                        ) : null}
                      </div>

                      <div className="calendar-cell-events">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div
                            key={e.id_epreuve}
                            className={`calendar-event-chip ${getSportClass(e.nom_sport)}`}
                          >
                            <span className="calendar-event-time">
                              {formatHour(e.date_heure)}
                            </span>
                            <span className="calendar-event-name">
                              {e.nom_epreuve}
                            </span>
                          </div>
                        ))}

                        {dayEvents.length > 2 ? (
                          <div className="calendar-more-events">
                            +{dayEvents.length - 2} épreuve(s)
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="calendar-detail-panel">
          <div className="calendar-detail-top">
            <p className="calendar-detail-kicker">Agenda du jour</p>
            <h2 className="calendar-detail-title">
              {selectedDate ? formatLongDate(selectedDate) : "Choisissez une date"}
            </h2>
            <p className="calendar-detail-subtitle">
              {selectedDate
                ? `${selectedEvents.length} épreuve(s) programmée(s)`
                : "Cliquez sur une date dans le calendrier pour afficher les compétitions."}
            </p>
          </div>

          <div className="calendar-detail-list">
            {!selectedDate ? (
              <div className="calendar-empty-state">
                Sélectionnez une journée pour afficher son programme détaillé.
              </div>
            ) : selectedEvents.length === 0 ? (
              <div className="calendar-empty-state">
                Aucune épreuve programmée ce jour.
              </div>
            ) : (
              selectedEvents.map((e) => (
                <div key={e.id_epreuve} className="calendar-detail-card">
                  <div className="calendar-detail-card-top">
                    <span className={`calendar-sport-badge ${getSportClass(e.nom_sport)}`}>
                      {e.nom_sport ?? "Sport"}
                    </span>
                    <span className="calendar-detail-hour">
                      {formatHour(e.date_heure)}
                    </span>
                  </div>

                  <h3 className="calendar-detail-event-title">{e.nom_epreuve}</h3>

                  <div className="calendar-detail-meta">
                    <span>📍 {e.nom_site ?? "Site à confirmer"}</span>
                  </div>

                  <div className="calendar-detail-actions">
                    <a className="calendar-detail-btn subtle" href={`/epreuves/${e.id_epreuve}`}>
                      Voir l’épreuve
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}