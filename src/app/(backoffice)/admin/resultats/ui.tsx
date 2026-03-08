"use client";

import { useEffect, useMemo, useState } from "react";

type Participation = { id_athlete: number; id_epreuve: number; inscription: string | null };
type Resultat = { id_athlete: number; id_epreuve: number; temps: string; classement: number };
type Athlete = { id_athlete: number; nom: string; prenom: string };
type Epreuve = { id_epreuve: number; nom_epreuve: string };

export default function AdminResultatsClient() {
  const [parts, setParts] = useState<Participation[]>([]);
  const [results, setResults] = useState<Resultat[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [selectedKey, setSelectedKey] = useState<string>(""); // "id_athlete-id_epreuve"
  const [temps, setTemps] = useState("");
  const [classement, setClassement] = useState<number>(1);

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

  const resultMap = useMemo(() => {
    const m = new Map<string, Resultat>();
    results.forEach((r) => m.set(`${r.id_athlete}-${r.id_epreuve}`, r));
    return m;
  }, [results]);

  async function load() {
    setLoading(true);
    setErr(null);

    const [resP, resR, resA, resE] = await Promise.all([
      fetch("/api/participations", { cache: "no-store" }),
      fetch("/api/resultats", { cache: "no-store" }),
      fetch("/api/athletes", { cache: "no-store" }),
      fetch("/api/epreuves", { cache: "no-store" }),
    ]);

    const jsonP = await resP.json().catch(() => null);
    const jsonR = await resR.json().catch(() => null);
    const jsonA = await resA.json().catch(() => null);
    const jsonE = await resE.json().catch(() => null);

    if (!resP.ok) {
      setErr(jsonP?.details ?? jsonP?.error ?? "Erreur chargement participations");
      setParts([]);
      setLoading(false);
      return;
    }
    if (!resR.ok) {
      setErr(jsonR?.details ?? jsonR?.error ?? "Erreur chargement résultats");
      setResults([]);
    } else setResults(jsonR?.data ?? []);

    if (resA.ok) setAthletes(jsonA?.data ?? []);
    if (resE.ok) setEpreuves(jsonE?.data ?? []);

    setParts(jsonP?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Quand on sélectionne une participation, si un résultat existe déjà, on pré-remplit
  useEffect(() => {
    if (!selectedKey) return;
    const existing = resultMap.get(selectedKey);
    if (existing) {
      setTemps(existing.temps);
      setClassement(existing.classement);
    } else {
      setTemps("");
      setClassement(1);
    }
  }, [selectedKey, resultMap]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!selectedKey) {
      setErr("Choisis une participation.");
      return;
    }
    if (!temps.trim()) {
      setErr("Temps obligatoire.");
      return;
    }

    const [id_athleteStr, id_epreuveStr] = selectedKey.split("-");
    const id_athlete = Number(id_athleteStr);
    const id_epreuve = Number(id_epreuveStr);

    const payload = { id_athlete, id_epreuve, temps: temps.trim(), classement: Number(classement) };

    const exists = resultMap.has(selectedKey);

    const res = await fetch("/api/resultats", {
      method: exists ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur sauvegarde résultat");
      return;
    }

    load();
  }

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="section-header">
        <h2 className="section-title">
          Gestion <span>Résultats</span>
        </h2>
        <p className="section-subtitle">
          Saisie/MAJ temps + classement (uniquement si participation existe)
        </p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onSave} style={{ display: "grid", gridTemplateColumns: "1.6fr 220px 180px 160px", gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Participation (Athlète ↔ Épreuve)</label>
            <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
              <option value="">-- choisir --</option>
              {parts.map((p) => {
                const key = `${p.id_athlete}-${p.id_epreuve}`;
                const a = athleteLabel.get(p.id_athlete) ?? `Athlète #${p.id_athlete}`;
                const ep = epreuveLabel.get(p.id_epreuve) ?? `Épreuve #${p.id_epreuve}`;
                const badge = resultMap.has(key) ? " (résultat existe)" : "";
                return (
                  <option key={key} value={key}>
                    {a} — {ep}{badge}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Temps</label>
            <input value={temps} onChange={(e) => setTemps(e.target.value)} placeholder="Ex: 1:45.32" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Classement</label>
            <input
              type="number"
              min={1}
              max={9999}
              value={classement}
              onChange={(e) => setClassement(Number(e.target.value))}
            />
          </div>

          <button className="btn-modal" style={{ width: "auto", alignSelf: "end" }} type="submit">
            Enregistrer
          </button>
        </form>

        {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 120px 1fr 160px 120px" }}>
          <div>ID Athlète</div>
          <div>Athlète</div>
          <div>ID Épreuve</div>
          <div>Épreuve</div>
          <div>Temps</div>
          <div>Rang</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucun résultat.</div>
          </div>
        ) : (
          results.map((r) => (
            <div
              key={`${r.id_athlete}-${r.id_epreuve}`}
              className="medal-row"
              style={{ gridTemplateColumns: "120px 1fr 120px 1fr 160px 120px" }}
            >
              <div>{r.id_athlete}</div>
              <div>{athleteLabel.get(r.id_athlete) ?? `#${r.id_athlete}`}</div>
              <div>{r.id_epreuve}</div>
              <div>{epreuveLabel.get(r.id_epreuve) ?? `#${r.id_epreuve}`}</div>
              <div>{r.temps}</div>
              <div className="gold">{r.classement}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}