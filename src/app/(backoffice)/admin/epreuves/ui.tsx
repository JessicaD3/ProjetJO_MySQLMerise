"use client";

import { useEffect, useMemo, useState } from "react";

type Sport = { id_sport: number; nom_sport: string };
type Site = { id_site: number; nom_site: string; capacite: number };
type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  id_sport: number;
  id_site: number;
  nom_sport?: string; // si ton GET /api/epreuves fait JOIN
  nom_site?: string;  // si JOIN
};

function toInputValue(dt: string) {
  // convert "YYYY-MM-DD HH:MM:SS" -> "YYYY-MM-DDTHH:MM"
  if (!dt) return "";
  return dt.replace(" ", "T").slice(0, 16);
}

export default function AdminEpreuvesClient() {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [nom, setNom] = useState("");
  const [dateHeure, setDateHeure] = useState(""); // datetime-local string
  const [idSport, setIdSport] = useState<number | "">("");
  const [idSite, setIdSite] = useState<number | "">("");

  const sportsMap = useMemo(() => new Map(sports.map(s => [s.id_sport, s.nom_sport])), [sports]);
  const sitesMap = useMemo(() => new Map(sites.map(s => [s.id_site, s.nom_site])), [sites]);

  async function load() {
    setLoading(true);
    setErr(null);

    const [resE, resS, resSi] = await Promise.all([
      fetch("/api/epreuves", { cache: "no-store" }),
      fetch("/api/sports", { cache: "no-store" }),
      fetch("/api/sites", { cache: "no-store" }),
    ]);

    const jsonE = await resE.json().catch(() => null);
    const jsonS = await resS.json().catch(() => null);
    const jsonSi = await resSi.json().catch(() => null);

    if (!resE.ok) {
      setErr(jsonE?.details ?? jsonE?.error ?? "Erreur chargement épreuves");
      setEpreuves([]);
      setSports([]);
      setSites([]);
      setLoading(false);
      return;
    }
    if (!resS.ok) {
      setErr(jsonS?.details ?? jsonS?.error ?? "Erreur chargement sports");
      setEpreuves(jsonE?.data ?? []);
      setSports([]);
      setSites([]);
      setLoading(false);
      return;
    }
    if (!resSi.ok) {
      setErr(jsonSi?.details ?? jsonSi?.error ?? "Erreur chargement sites");
      setEpreuves(jsonE?.data ?? []);
      setSports(jsonS?.data ?? []);
      setSites([]);
      setLoading(false);
      return;
    }

    setEpreuves(jsonE?.data ?? []);
    setSports(jsonS?.data ?? []);
    setSites(jsonSi?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!idSport || !idSite) {
      setErr("Choisis un sport et un site.");
      return;
    }
    if (!dateHeure) {
      setErr("Choisis une date/heure.");
      return;
    }

    // Backend accepte string ISO ou "YYYY-MM-DD HH:MM:SS"
    const payload = {
      nom_epreuve: nom,
      date_heure: dateHeure, // ex "2026-02-15T14:00"
      id_sport: Number(idSport),
      id_site: Number(idSite),
    };

    const res = await fetch("/api/epreuves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur création");
      return;
    }

    setNom("");
    setDateHeure("");
    setIdSport("");
    setIdSite("");
    load();
  }

  async function onDelete(id_epreuve: number) {
    setErr(null);
    const res = await fetch(`/api/epreuves/${id_epreuve}`, { method: "DELETE" });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur suppression");
      return;
    }
    load();
  }

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="section-header">
        <h2 className="section-title">
          Gestion <span>Épreuves</span>
        </h2>
        <p className="section-subtitle">CRUD backoffice (sport + site + date/heure)</p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "1.2fr 220px 1fr 1fr 160px", gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Nom épreuve</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Descente hommes" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Date/heure</label>
            <input type="datetime-local" value={dateHeure} onChange={(e) => setDateHeure(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Sport</label>
            <select value={idSport} onChange={(e) => setIdSport(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- choisir --</option>
              {sports.map((s) => (
                <option key={s.id_sport} value={s.id_sport}>{s.nom_sport}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Site</label>
            <select value={idSite} onChange={(e) => setIdSite(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- choisir --</option>
              {sites.map((s) => (
                <option key={s.id_site} value={s.id_site}>{s.nom_site} (cap {s.capacite})</option>
              ))}
            </select>
          </div>

          <button className="btn-modal" style={{ width: "auto", alignSelf: "end" }} type="submit">
            Ajouter
          </button>
        </form>

        {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "90px 1fr 200px 1fr 1fr 160px" }}>
          <div>ID</div>
          <div>Épreuve</div>
          <div>Date/heure</div>
          <div>Sport</div>
          <div>Site</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : epreuves.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucune épreuve.</div>
          </div>
        ) : (
          epreuves.map((e) => (
            <div
              key={e.id_epreuve}
              className="medal-row"
              style={{ gridTemplateColumns: "90px 1fr 200px 1fr 1fr 160px" }}
            >
              <div>{e.id_epreuve}</div>
              <div>{e.nom_epreuve}</div>
              <div>{toInputValue(e.date_heure).replace("T", " ")}</div>
              <div>{e.nom_sport ?? sportsMap.get(e.id_sport) ?? `#${e.id_sport}`}</div>
              <div>{e.nom_site ?? sitesMap.get(e.id_site) ?? `#${e.id_site}`}</div>
              <div>
                <button className="filter-btn" onClick={() => onDelete(e.id_epreuve)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}