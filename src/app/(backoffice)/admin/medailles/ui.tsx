"use client";

import { useEffect, useMemo, useState } from "react";

type Epreuve = { id_epreuve: number; nom_epreuve: string };
type Athlete = { id_athlete: number; nom: string; prenom: string; id_pays: number };
type Pays = { id_pays: number; nom_pays: string };

type ResultatRow = {
  id_athlete: number;
  nom: string;
  prenom: string;
  nom_pays: string;
  temps: string;
  classement: number;
};

type Medaille = {
  id_medaille?: number;
  id_epreuve: number;
  id_athlete: number;
  type_medaille: "OR" | "ARGENT" | "BRONZE";
};

export default function AdminMedaillesClient() {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [medailles, setMedailles] = useState<Medaille[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // selection
  const [selectedEpreuve, setSelectedEpreuve] = useState<number | "">("");
  const [resultats, setResultats] = useState<ResultatRow[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<number | "">("");
  const [type, setType] = useState<"OR" | "ARGENT" | "BRONZE">("OR");

  const epreuveMap = useMemo(() => new Map(epreuves.map(e => [e.id_epreuve, e.nom_epreuve])), [epreuves]);

  async function load() {
    setLoading(true);
    setErr(null);

    const [resE, resM] = await Promise.all([
      fetch("/api/epreuves", { cache: "no-store" }),
      fetch("/api/medailles", { cache: "no-store" }),
    ]);

    const jsonE = await resE.json().catch(() => null);
    const jsonM = await resM.json().catch(() => null);

    if (!resE.ok) {
      setErr(jsonE?.details ?? jsonE?.error ?? "Erreur chargement épreuves");
      setEpreuves([]);
      setMedailles([]);
      setLoading(false);
      return;
    }
    if (!resM.ok) {
      setErr(jsonM?.details ?? jsonM?.error ?? "Erreur chargement médailles");
      setEpreuves(jsonE?.data ?? []);
      setMedailles([]);
      setLoading(false);
      return;
    }

    setEpreuves(jsonE?.data ?? []);
    setMedailles(jsonM?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // charger les résultats de l’épreuve sélectionnée (public endpoint)
  useEffect(() => {
    async function loadResultats(epreuveId: number) {
      setErr(null);
      setResultats([]);
      setSelectedAthlete("");

      const res = await fetch(`/api/epreuves/${epreuveId}/resultats`, { cache: "no-store" });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(json?.details ?? json?.error ?? "Erreur chargement résultats");
        return;
      }

      setResultats(json?.data ?? []);
    }

    if (selectedEpreuve) loadResultats(Number(selectedEpreuve));
  }, [selectedEpreuve]);

  async function onAttribuer(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!selectedEpreuve) {
      setErr("Choisis une épreuve.");
      return;
    }
    if (!selectedAthlete) {
      setErr("Choisis un athlète (dans les résultats).");
      return;
    }

    const payload = {
      id_epreuve: Number(selectedEpreuve),
      id_athlete: Number(selectedAthlete),
      type_medaille: type,
    };

    const res = await fetch("/api/medailles/attribuer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur attribution médaille");
      return;
    }

    // refresh médailles
    setSelectedAthlete("");
    await load();
  }

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="section-header">
        <h2 className="section-title">
          Gestion <span>Médailles</span>
        </h2>
        <p className="section-subtitle">Attribuer OR/ARGENT/BRONZE à partir des résultats</p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onAttribuer} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 220px 160px", gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Épreuve</label>
            <select value={selectedEpreuve} onChange={(e) => setSelectedEpreuve(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- choisir --</option>
              {epreuves.map((e) => (
                <option key={e.id_epreuve} value={e.id_epreuve}>{e.nom_epreuve}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Athlète (depuis résultats)</label>
            <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- choisir --</option>
              {resultats.map((r) => (
                <option key={r.id_athlete} value={r.id_athlete}>
                  #{r.classement} {r.nom} {r.prenom} ({r.nom_pays}) — {r.temps}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Type médaille</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="OR">OR</option>
              <option value="ARGENT">ARGENT</option>
              <option value="BRONZE">BRONZE</option>
            </select>
          </div>

          <button className="btn-modal" style={{ width: "auto", alignSelf: "end" }} type="submit">
            Attribuer
          </button>
        </form>

        {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 140px 1fr 200px" }}>
          <div>ID Épreuve</div>
          <div>Épreuve</div>
          <div>Type</div>
          <div>ID Athlète</div>
          <div>Athlète</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : medailles.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucune médaille.</div>
          </div>
        ) : (
          medailles.map((m, idx) => (
            <div
              key={`${m.id_epreuve}-${m.type_medaille}-${m.id_athlete}-${idx}`}
              className="medal-row"
              style={{ gridTemplateColumns: "120px 1fr 140px 1fr 200px" }}
            >
              <div>{m.id_epreuve}</div>
              <div>{epreuveMap.get(m.id_epreuve) ?? `#${m.id_epreuve}`}</div>
              <div className={m.type_medaille === "OR" ? "gold" : m.type_medaille === "ARGENT" ? "silver" : "bronze"}>
                {m.type_medaille}
              </div>
              <div>{m.id_athlete}</div>
              <div>#{m.id_athlete}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}