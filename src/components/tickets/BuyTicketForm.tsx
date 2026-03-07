"use client";

import { useEffect, useState } from "react";

type Props = {
  idEpreuve: number;
  defaultPrice?: number;
  eventName?: string;
  sportName?: string;
  venueName?: string;
  remaining?: number;
  soldOut?: boolean;
};

type Me = {
  login: string;
  nom_role: string;
};

export default function BuyTicketForm({
  idEpreuve,
  defaultPrice = 85,
  eventName,
  sportName,
  venueName,
  remaining = 0,
  soldOut = false,
}: Props) {
  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [quantite, setQuantite] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const prix = defaultPrice;

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

    if (!nom.trim() || !prenom.trim()) {
      setMsg("Nom et prénom sont obligatoires.");
      return;
    }

    if (!Number.isInteger(quantite) || quantite < 1) {
      setMsg("La quantité doit être d’au moins 1 billet.");
      return;
    }

    if (quantite > remaining) {
      setMsg(`Impossible d’acheter ${quantite} billet(s). Il ne reste que ${remaining} place(s).`);
      return;
    }

    setSubmitting(true);

    try {
      const createdIds: number[] = [];

      for (let i = 0; i < quantite; i += 1) {
        const res = await fetch("/api/achats/billets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_epreuve: idEpreuve,
            nom: nom.trim(),
            prenom: prenom.trim(),
            prix_achat: Number(prix),
          }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setMsg(
            String(
              json?.details ??
                json?.error ??
                "Achat impossible"
            )
          );
          return;
        }

        const idBillet = Number(json?.data?.id_billet);
        if (!Number.isNaN(idBillet)) {
          createdIds.push(idBillet);
        }
      }

      if (createdIds.length === 1) {
        setMsg("✅ Billet acheté ! Redirection vers votre billet…");
        setTimeout(() => {
          window.location.href = `/billets/${createdIds[0]}`;
        }, 700);
      } else {
        setMsg(`✅ ${createdIds.length} billets achetés avec succès !`);
        setTimeout(() => {
          window.location.href = "/compte";
        }, 900);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingMe) return null;

  return (
    <div className="official-form-wrap">
      <div className="official-form-head">
        <p className="official-form-kicker">Réservation</p>
        <h3 className="official-form-title">Acheter un billet officiel</h3>
        <p className="official-form-subtitle">
          {sportName ? `${sportName} · ` : ""}
          {eventName ?? "Épreuve"}
          {venueName ? ` · ${venueName}` : ""}
        </p>
      </div>

      <div className="official-form-price-row">
        <div>
          <span className="official-form-price-label">Tarif officiel</span>
          <strong className="official-form-price-value">{prix} €</strong>
        </div>
        <div className="official-form-availability">
          {soldOut ? "Complet" : `${remaining} place(s) disponible(s)`}
        </div>
      </div>

      {!me ? (
        <div className="official-login-box">
          <p>
            Vous devez être connecté avec un compte pour acheter
            un billet.
          </p>
          <button
            className="official-pay-button"
            type="button"
            onClick={() => (window.location.href = "/login")}
          >
            <span>Connexion requise</span>
            <strong>Se connecter</strong>
          </button>
        </div>
      ) : soldOut ? (
        <div className="official-login-box">
          <p>Cette épreuve n’a plus de places disponibles pour le moment.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="official-ticket-form">
          <div className="official-beneficiary-title">
            <i>•</i>
            <span>Bénéficiaire du lot de billets</span>
          </div>

          <div className="official-form-row">
            <div className="official-input-group">
              <label>Nom</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Dupont"
              />
            </div>

            <div className="official-input-group">
              <label>Prénom</label>
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Paul"
              />
            </div>
          </div>

          <div className="official-form-row official-form-row-single">
            <div className="official-input-group">
              <label>Quantité</label>
              <input
                type="number"
                min={1}
                max={Math.max(1, remaining)}
                value={quantite}
                onChange={(e) => setQuantite(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="official-fixed-price-box">
            <span className="official-fixed-price-label">Tarif officiel</span>
            <strong className="official-fixed-price-value">{prix} € / billet</strong>
          </div>

          <div className="official-fixed-price-box">
            <span className="official-fixed-price-label">Total estimé</span>
            <strong className="official-fixed-price-value">
              {(prix * quantite).toFixed(2)} €
            </strong>
          </div>

          <div className="official-notice-text">
            <span>✓</span>
            <p>
              Le prix et la place sont attribués automatiquement après validation du paiement.
            </p>
          </div>

          <div className="official-notice-text">
            <span>✓</span>
            <p>
              Tous les billets seront enregistrés sous le même nom et prénom,
              puis rattachés à votre compte utilisateur.
            </p>
          </div>

          {msg ? (
            <p className={msg.startsWith("✅") ? "official-msg success" : "official-msg error"}>
              {msg}
            </p>
          ) : null}

          <button className="official-pay-button" type="submit" disabled={submitting}>
            <span>Paiement sécurisé</span>
            <strong>
              {submitting
                ? "Achat en cours..."
                : quantite > 1
                ? `Confirmer l’achat de ${quantite} billets`
                : "Confirmer l’achat"}
            </strong>
          </button>
        </form>
      )}
    </div>
  );
}