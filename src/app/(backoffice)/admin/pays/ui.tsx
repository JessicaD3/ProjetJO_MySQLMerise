"use client";

import { useEffect, useState } from "react";

type Pays = { id_pays: number; nom_pays: string };

export default function AdminPaysClient() {
  const [items, setItems] = useState<Pays[]>([]);
  const [nom, setNom] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/pays", { cache: "no-store" });
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

    const res = await fetch("/api/pays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom_pays: nom }),
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur création");
      return;
    }

    setNom("");
    load();
  }

  async function onDelete(id_pays: number) {
    setErr(null);
    const res = await fetch(`/api/pays/${id_pays}`, { method: "DELETE" });
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
          Gestion <span>Pays</span>
        </h2>
        <p className="section-subtitle">CRUD backoffice (API sécurisée RBAC)</p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onCreate} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="form-group" style={{ marginBottom: 0, flex: "1 1 320px" }}>
            <label>Nom du pays</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: France" />
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
          <div>Pays</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucun pays.</div>
          </div>
        ) : (
          items.map((p) => (
            <div key={p.id_pays} className="medal-row" style={{ gridTemplateColumns: "120px 1fr 160px" }}>
              <div>{p.id_pays}</div>
              <div>{p.nom_pays}</div>
              <div>
                <button className="filter-btn" onClick={() => onDelete(p.id_pays)}>
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