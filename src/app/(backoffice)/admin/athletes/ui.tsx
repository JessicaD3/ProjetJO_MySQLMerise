"use client";

import { useEffect, useMemo, useState } from "react";

type Pays = { id_pays: number; nom_pays: string };
type Athlete = { id_athlete: number; nom: string; prenom: string; sexe: string; id_pays: number };

export default function AdminAthletesClient() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [pays, setPays] = useState<Pays[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState<"M" | "F">("M");
  const [idPays, setIdPays] = useState<number | "">("");

  const paysMap = useMemo(() => {
    const m = new Map<number, string>();
    pays.forEach((p) => m.set(p.id_pays, p.nom_pays));
    return m;
  }, [pays]);

  async function load() {
    setLoading(true);
    setErr(null);

    const [resA, resP] = await Promise.all([
      fetch("/api/athletes", { cache: "no-store" }),
      fetch("/api/pays", { cache: "no-store" }),
    ]);

    const jsonA = await resA.json().catch(() => null);
    const jsonP = await resP.json().catch(() => null);

    if (!resA.ok) {
      setErr(jsonA?.details ?? jsonA?.error ?? "Erreur chargement athletes");
      setAthletes([]);
      setPays([]);
      setLoading(false);
      return;
    }
    if (!resP.ok) {
      setErr(jsonP?.details ?? jsonP?.error ?? "Erreur chargement pays");
      setAthletes(jsonA?.data ?? []);
      setPays([]);
      setLoading(false);
      return;
    }

    setAthletes(jsonA?.data ?? []);
    setPays(jsonP?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!idPays) {
      setErr("Choisis un pays.");
      return;
    }

    const res = await fetch("/api/athletes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, sexe, id_pays: Number(idPays) }),
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur création");
      return;
    }

    setNom("");
    setPrenom("");
    setSexe("M");
    setIdPays("");
    load();
  }

  async function onDelete(id_athlete: number) {
    setErr(null);

    const res = await fetch(`/api/athletes/${id_athlete}`, { method: "DELETE" });
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
          Gestion <span>Athlètes</span>
        </h2>
        <p className="section-subtitle">CRUD backoffice (rattaché à Pays)</p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px 1fr 160px", gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Nom</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Pinturault" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Prénom</label>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Ex: Alexis" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Sexe</label>
            <select value={sexe} onChange={(e) => setSexe(e.target.value as "M" | "F")}>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Pays</label>
            <select value={idPays} onChange={(e) => setIdPays(e.target.value ? Number(e.target.value) : "")}>
              <option value="">-- choisir --</option>
              {pays.map((p) => (
                <option key={p.id_pays} value={p.id_pays}>
                  {p.nom_pays}
                </option>
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
        <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 1fr 120px 1fr 160px" }}>
          <div>ID</div>
          <div>Nom</div>
          <div>Prénom</div>
          <div>Sexe</div>
          <div>Pays</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : athletes.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucun athlète.</div>
          </div>
        ) : (
          athletes.map((a) => (
            <div
              key={a.id_athlete}
              className="medal-row"
              style={{ gridTemplateColumns: "120px 1fr 1fr 120px 1fr 160px" }}
            >
              <div>{a.id_athlete}</div>
              <div>{a.nom}</div>
              <div>{a.prenom}</div>
              <div className="gold">{a.sexe}</div>
              <div>{paysMap.get(a.id_pays) ?? `#${a.id_pays}`}</div>
              <div>
                <button className="filter-btn" onClick={() => onDelete(a.id_athlete)}>
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