"use client";

import { useEffect, useState } from "react";

type Sport = { id_sport: number; nom_sport: string };

export default function AdminSportsClient() {
  const [items, setItems] = useState<Sport[]>([]);
  const [nom, setNom] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/sports", { cache: "no-store" });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur chargement");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const res = await fetch("/api/sports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom_sport: nom }),
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur création");
      return;
    }

    setNom("");
    load();
  }

  async function onDelete(id_sport: number) {
    setErr(null);

    const res = await fetch(`/api/sports/${id_sport}`, { method: "DELETE" });
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
          Gestion <span>Sports</span>
        </h2>
        <p className="section-subtitle">Gestion des disciplines olympiques</p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onCreate} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="form-group" style={{ marginBottom: 0, flex: "1 1 320px" }}>
            <label>Nom du sport</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Ski Alpin" />
          </div>

          <button className="btn-modal" style={{ width: "auto", alignSelf: "end" }} type="submit">
            Ajouter
          </button>
        </form>

        {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 160px" }}>
          <div>ID</div>
          <div>Sport</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucun sport.</div>
          </div>
        ) : (
          items.map((s) => (
            <div key={s.id_sport} className="medal-row" style={{ gridTemplateColumns: "120px 1fr 160px" }}>
              <div>{s.id_sport}</div>
              <div>{s.nom_sport}</div>
              <div>
                <button className="filter-btn" onClick={() => onDelete(s.id_sport)}>
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