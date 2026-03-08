"use client";

import { useEffect, useMemo, useState } from "react";

type Athlete = { id_athlete: number; nom: string; prenom: string; sexe: string; id_pays: number };
type Epreuve = { id_epreuve: number; nom_epreuve: string; date_heure: string; nom_sport?: string; nom_site?: string };
type Participation = { id_athlete: number; id_epreuve: number; inscription: string | null };

export default function AdminParticipationsClient() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [items, setItems] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [idAthlete, setIdAthlete] = useState<number | "">("");
  const [idEpreuve, setIdEpreuve] = useState<number | "">("");
  const [inscription, setInscription] = useState<string>("");

  const athleteLabel = useMemo(() => {
    const m = new Map<number, string>();
    athletes.forEach((a) => m.set(a.id_athlete, `${a.nom} ${a.prenom}`));
    return m;
  }, [athletes]);

  const epreuveLabel = useMemo(() => {
    const m = new Map<number, string>();
    epreuves.forEach((e) => m.set(e.id_epreuve, e.nom_epreuve));
    return m;
  }, [epreuves]);

  async function load() {
    setLoading(true);
    setErr(null);

    const [resPart, resAth, resEpr] = await Promise.all([
      fetch("/api/participations", { cache: "no-store" }),
      fetch("/api/athletes", { cache: "no-store" }),
      fetch("/api/epreuves", { cache: "no-store" }),
    ]);

    const jsonPart = await resPart.json().catch(() => null);
    const jsonAth = await resAth.json().catch(() => null);
    const jsonEpr = await resEpr.json().catch(() => null);

    if (!resPart.ok) {
      setErr(jsonPart?.details ?? jsonPart?.error ?? "Erreur chargement participations");
      setItems([]);
      setLoading(false);
      return;
    }
    if (!resAth.ok) {
      setErr(jsonAth?.details ?? jsonAth?.error ?? "Erreur chargement athlètes");
      setAthletes([]);
    } else {
      setAthletes(jsonAth?.data ?? []);
    }
    if (!resEpr.ok) {
      setErr(jsonEpr?.details ?? jsonEpr?.error ?? "Erreur chargement épreuves");
      setEpreuves([]);
    } else {
      setEpreuves(jsonEpr?.data ?? []);
    }

    setItems(jsonPart?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!idAthlete || !idEpreuve) {
      setErr("Choisis un athlète et une épreuve.");
      return;
    }

    const payload: any = { id_athlete: Number(idAthlete), id_epreuve: Number(idEpreuve) };
    if (inscription.trim()) payload.inscription = inscription.trim();

    const res = await fetch("/api/participations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur création participation");
      return;
    }

    setIdAthlete("");
    setIdEpreuve("");
    setInscription("");
    load();
  }

  async function onDelete(p: Participation) {
    setErr(null);

    const res = await fetch("/api/participations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_athlete: p.id_athlete, id_epreuve: p.id_epreuve }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur suppression participation");
      return;
    }

    load();
  }

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="section-header">
        <h2 className="section-title">
          Gestion <span>Participations</span>
        </h2>
        <p className="section-subtitle">Athlète ↔ Épreuve (création / suppression)</p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 220px 160px", gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Athlète</label>
            <select value={idAthlete} onChange={(e) => setIdAthlete(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- choisir --</option>
              {athletes.map((a) => (
                <option key={a.id_athlete} value={a.id_athlete}>
                  {a.nom} {a.prenom} ({a.sexe})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Épreuve</label>
            <select value={idEpreuve} onChange={(e) => setIdEpreuve(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- choisir --</option>
              {epreuves.map((e) => (
                <option key={e.id_epreuve} value={e.id_epreuve}>
                  {e.nom_epreuve}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Inscription (optionnel)</label>
            <input
              value={inscription}
              onChange={(e) => setInscription(e.target.value)}
              placeholder="Ex: 2026-02-01"
            />
          </div>

          <button className="btn-modal" style={{ width: "auto", alignSelf: "end" }} type="submit">
            Ajouter
          </button>
        </form>

        {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 120px 1fr 220px 160px" }}>
          <div>ID Athlète</div>
          <div>Athlète</div>
          <div>ID Épreuve</div>
          <div>Épreuve</div>
          <div>Inscription</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucune participation.</div>
          </div>
        ) : (
          items.map((p) => (
            <div
              key={`${p.id_athlete}-${p.id_epreuve}`}
              className="medal-row"
              style={{ gridTemplateColumns: "120px 1fr 120px 1fr 220px 160px" }}
            >
              <div>{p.id_athlete}</div>
              <div>{athleteLabel.get(p.id_athlete) ?? `#${p.id_athlete}`}</div>
              <div>{p.id_epreuve}</div>
              <div>{epreuveLabel.get(p.id_epreuve) ?? `#${p.id_epreuve}`}</div>
              <div>{p.inscription ?? "-"}</div>
              <div>
                <button className="filter-btn" onClick={() => onDelete(p)}>
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