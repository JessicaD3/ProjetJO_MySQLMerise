"use client";

import { useEffect, useMemo, useState } from "react";

type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  nom_site?: string;
  nom_sport?: string;
};

type EpreuveDetail = {
  id_epreuve: number;
  capacite: number;
};

type Billet = {
  id_billet: number;
  id_epreuve: number;
  id_utilisateur: number;
  nom: string;
  prenom: string;
  date_achat: string;
  num_place: string;
  prix_achat: number;
};

export default function AdminBilletterieClient() {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [billets, setBillets] = useState<Billet[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [idEpreuve, setIdEpreuve] = useState<number | "">("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numPlace, setNumPlace] = useState("");
  const [prix, setPrix] = useState<number>(85);

  // infos capacité
  const [capacite, setCapacite] = useState<number | null>(null);
  const [sold, setSold] = useState<number | null>(null);

  const remaining = useMemo(() => {
    if (capacite == null || sold == null) return null;
    return Math.max(0, capacite - sold);
  }, [capacite, sold]);

  async function load() {
    setLoading(true);
    setErr(null);

    const [resE, resB] = await Promise.all([
      fetch("/api/epreuves", { cache: "no-store" }),
      fetch("/api/billets", { cache: "no-store" }),
    ]);

    const jsonE = await resE.json().catch(() => null);
    const jsonB = await resB.json().catch(() => null);

    if (!resE.ok) {
      setErr(jsonE?.details ?? jsonE?.error ?? "Erreur chargement épreuves");
      setEpreuves([]);
      setBillets([]);
      setLoading(false);
      return;
    }

    if (!resB.ok) {
      setErr(jsonB?.details ?? jsonB?.error ?? "Erreur chargement billets (RBAC?)");
      setEpreuves(jsonE?.data ?? []);
      setBillets([]);
      setLoading(false);
      return;
    }

    setEpreuves(jsonE?.data ?? []);
    setBillets(jsonB?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Quand on sélectionne une épreuve : charger capacité + count vendus
  useEffect(() => {
    async function loadCapacity(epreuveId: number) {
      setErr(null);
      setCapacite(null);
      setSold(null);

      const [resDetail, resCount] = await Promise.all([
        fetch(`/api/epreuves/${epreuveId}`, { cache: "no-store" }),
        fetch(`/api/epreuves/${epreuveId}/billets/count`, { cache: "no-store" }),
      ]);

      const jsonD = await resDetail.json().catch(() => null);
      const jsonC = await resCount.json().catch(() => null);

      if (resDetail.ok) {
        const d = (jsonD?.data ?? null) as any;
        setCapacite(Number(d?.capacite ?? 0));
      } else {
        setErr(jsonD?.details ?? jsonD?.error ?? "Erreur chargement détail épreuve");
      }

      if (resCount.ok) {
        setSold(Number(jsonC?.data?.count ?? 0));
      } else {
        setErr(jsonC?.details ?? jsonC?.error ?? "Erreur chargement count billets");
      }
    }

    if (idEpreuve) loadCapacity(Number(idEpreuve));
  }, [idEpreuve]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!idEpreuve) return setErr("Choisis une épreuve.");
    if (!nom.trim() || !prenom.trim()) return setErr("Nom + prénom obligatoires.");
    if (!numPlace.trim()) return setErr("Numéro de place obligatoire.");

    const res = await fetch("/api/billets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_epreuve: Number(idEpreuve),
        nom: nom.trim(),
        prenom: prenom.trim(),
        num_place: numPlace.trim(),
        prix_achat: Number(prix),
      }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.details ?? json?.error ?? "Erreur vente billet");
      return;
    }

    // reset form
    setNom("");
    setPrenom("");
    setNumPlace("");
    setPrix(85);

    await load();
    // recharge capacité/count
    if (idEpreuve) {
      // trigger useEffect by setting same value (quick trick)
      setIdEpreuve(Number(idEpreuve));
    }
  }

  const epreuveMap = useMemo(() => new Map(epreuves.map(e => [e.id_epreuve, e.nom_epreuve])), [epreuves]);

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="section-header">
        <h2 className="section-title">
          Gestion <span>Billetterie</span>
        </h2>
        <p className="section-subtitle">Vente de billets + contrôle capacité (backend)</p>
      </div>

      {/* Form vente */}
      <div className="medals-table" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 220px 160px", gap: 12 }}>
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
            <label>Nom bénéficiaire</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Dupont" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Prénom bénéficiaire</label>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Ex: Alice" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Numéro de place</label>
            <input value={numPlace} onChange={(e) => setNumPlace(e.target.value)} placeholder="Ex: A-01" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Prix (€)</label>
            <input type="number" min={0} value={prix} onChange={(e) => setPrix(Number(e.target.value))} />
          </div>

          <button className="btn-modal" style={{ gridColumn: "1 / -1" }} type="submit">
            Vendre le billet
          </button>
        </form>

        {/* Capacité */}
        {idEpreuve ? (
          <p style={{ marginTop: 10, color: "var(--text-soft)" }}>
            Capacité : <strong>{capacite ?? "..."}</strong> — Vendus : <strong>{sold ?? "..."}</strong> — Restants :{" "}
            <strong style={{ color: "var(--gold)" }}>{remaining ?? "..."}</strong>
          </p>
        ) : null}

        {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}
      </div>

      {/* Liste billets */}
      <div className="medals-table">
        <div className="medals-header" style={{ gridTemplateColumns: "90px 1fr 1fr 1fr 140px 140px 200px" }}>
          <div>ID</div>
          <div>Épreuve</div>
          <div>Nom</div>
          <div>Prénom</div>
          <div>Place</div>
          <div>Prix</div>
          <div>Date achat</div>
        </div>

        {loading ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Chargement...</div>
          </div>
        ) : billets.length === 0 ? (
          <div className="medal-row" style={{ gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>Aucun billet.</div>
          </div>
        ) : (
          billets.map((b) => (
            <div
              key={b.id_billet}
              className="medal-row"
              style={{ gridTemplateColumns: "90px 1fr 1fr 1fr 140px 140px 200px" }}
            >
              <div>{b.id_billet}</div>
              <div>{epreuveMap.get(b.id_epreuve) ?? `#${b.id_epreuve}`}</div>
              <div>{b.nom}</div>
              <div>{b.prenom}</div>
              <div>{b.num_place}</div>
              <div className="gold">{b.prix_achat}€</div>
              <div>{b.date_achat}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}