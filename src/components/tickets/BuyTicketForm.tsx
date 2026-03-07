"use client";

import { useEffect, useState } from "react";

type Props = {
  idEpreuve: number;
  defaultPrice?: number;
};

export default function BuyTicketForm({ idEpreuve, defaultPrice = 85 }: Props) {
  const [me, setMe] = useState<{ login: string; nom_role: string } | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numPlace, setNumPlace] = useState("");
  const [prix, setPrix] = useState<number>(defaultPrice);

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingMe(true);
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok) setMe(json?.data ?? null);
      else setMe(null);
      setLoadingMe(false);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!me) {
      window.location.href = "/login";
      return;
    }
    if (me.nom_role !== "LECTEUR") {
      setMsg("Seuls les comptes LECTEUR peuvent acheter des billets ici.");
      return;
    }
    if (!nom.trim() || !prenom.trim() || !numPlace.trim()) {
      setMsg("Nom, prénom et numéro de place sont obligatoires.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/achats/billets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_epreuve: idEpreuve,
          nom: nom.trim(),
          prenom: prenom.trim(),
          num_place: numPlace.trim(),
          prix_achat: Number(prix),
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg(String(json?.details ?? json?.error ?? "Achat impossible"));
        return;
      }

      const id_billet = json?.data?.id_billet;
      setMsg("✅ Billet acheté ! Redirection vers la facture…");
      setTimeout(() => {
        window.location.href = `/billets/${id_billet}`;
      }, 700);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingMe) return null;

  return (
    <div className="medals-table" style={{ padding: 20, marginTop: 30 }}>
      <h3 style={{ marginTop: 0, color: "var(--text-dark)" }}>Acheter un billet</h3>

      {!me ? (
        <div>
          <p style={{ color: "var(--text-soft)" }}>
            Vous devez être connecté (LECTEUR) pour acheter un billet.
          </p>
          <button className="btn-modal" onClick={() => (window.location.href = "/login")}>
            Se connecter
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Nom bénéficiaire</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Dupont" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Prénom bénéficiaire</label>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Alice" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Numéro de place</label>
            <input value={numPlace} onChange={(e) => setNumPlace(e.target.value)} placeholder="A-01" />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Prix (€)</label>
            <input type="number" min={0} value={prix} onChange={(e) => setPrix(Number(e.target.value))} />
          </div>

          {msg ? <p style={{ color: msg.startsWith("✅") ? "green" : "crimson", margin: 0 }}>{msg}</p> : null}

          <button className="btn-modal" type="submit" disabled={submitting}>
            {submitting ? "Achat..." : "Acheter"}
          </button>
        </form>
      )}
    </div>
  );
}