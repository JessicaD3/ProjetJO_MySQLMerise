"use client";

import { useEffect, useState } from "react";

type Site = { id_site: number; nom_site: string; capacite: number };

export default function AdminSitesClient() {
  const [items, setItems] = useState<Site[]>([]);
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState<number>(1000);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/sites", { cache: "no-store" });
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

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom_site: nom, capacite }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur création");
      return;
    }

    setNom("");
    setCapacite(1000);
    load();
  }

  async function onDelete(id_site: number) {
    setErr(null);

    const res = await fetch(`/api/sites/${id_site}`, { method: "DELETE" });
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
          Gestion <span>Sites</span>
        </h2>
        <p className="section-subtitle">Lieux de compétition et capacités d’accueil</p>
      </div>

      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onCreate} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="form-group" style={{ marginBottom: 0, flex: "1 1 320px" }}>
            <label>Nom du site</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Palavela" />
          </div>

          <div className="form-group" style={{ marginBottom: 0, width: 220 }}>
            <label>Capacité</label>
            <input
              type="number"
              value={capacite}
              onChange={(e) => setCapacite(Number(e.target.value))}
              min={1}
              max={100000}
            />
          </div>

          <button className="btn-modal" style={{ width: "auto", alignSelf: "end" }} type="submit">
            Ajouter
          </button>
        </form>

        {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}
      </div>

      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "120px 1fr 160px 160px" }}>
          <div>ID</div>
          <div>Site</div>
          <div>Capacité</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucun site.</div>
          </div>
        ) : (
          items.map((s) => (
            <div
              key={s.id_site}
              className="medal-row"
              style={{ gridTemplateColumns: "120px 1fr 160px 160px" }}
            >
              <div>{s.id_site}</div>
              <div>{s.nom_site}</div>
              <div className="gold">{s.capacite}</div>
              <div>
                <button className="filter-btn" onClick={() => onDelete(s.id_site)}>
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