"use client";

import { useState } from "react";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, mot_de_passe: motDePasse }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      setError(j?.details ?? "Connexion impossible");
      return;
    }

    window.location.href = "/compte";
  }

  return (
    <div className="section" style={{ paddingTop: 140, display: "flex", justifyContent: "center" }}>
      <form className="modal-content" onSubmit={onSubmit}>
        <h2>Bienvenue aux Jeux</h2>
        <p>Connectez-vous pour accéder à votre espace personnel</p>

        <div className="form-group">
          <label>Login</label>
          <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="votre@email.com" />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="••••••••" />
        </div>

        {error ? <p style={{ color: "crimson", marginBottom: 12 }}>{String(error)}</p> : null}

        <button className="btn-modal" type="submit">Se connecter</button>
        <a className="btn-modal" style={{ background: "transparent", border: "2px solid var(--gold)", color: "var(--gold)", display: "block", textAlign: "center" }} href="/register">
          Créer un compte
        </a>
      </form>
    </div>
  );
}