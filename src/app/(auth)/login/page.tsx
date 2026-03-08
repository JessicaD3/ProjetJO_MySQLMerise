"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ApiError = { error?: string; details?: unknown };

export default function LoginPage() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1) Login -> pose le cookie httpOnly
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, mot_de_passe: motDePasse }),
      });

      const json = (await res.json().catch(() => null)) as any;

      if (!res.ok) {
        const err = (json ?? {}) as ApiError;
        const details = typeof err.details === "string" ? err.details : "";
        setErrorMsg(details || err.error || "Connexion impossible");
        setLoading(false);
        return;
      }

      // 2) Récupère /me pour connaître le rôle (sécurisé)
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const meJson = await meRes.json().catch(() => null);

      const role = meJson?.data?.nom_role as string | undefined;

      // 3) Redirection selon rôle
      if (role === "LECTEUR") {
        router.replace("/");
      } else if (role) {
        router.replace("/admin");
      } else {
        // fallback si /me ne renvoie rien (rare)
        router.replace("/");
      }
    } catch (err) {
      setErrorMsg("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section" style={{ paddingTop: 140, maxWidth: 520 }}>
      <div className="section-header">
        <h2 className="section-title">
          CONNEXION <span>COMPTE</span>
        </h2>
        <p className="section-subtitle">Connecte-toi pour accéder à ton espace</p>
      </div>

      <div className="medals-table" style={{ padding: 25 }}>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Login (email)</label>
            <input
              type="email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {errorMsg ? (
            <p style={{ color: "crimson", margin: 0 }}>{errorMsg}</p>
          ) : null}

          <button className="btn-modal" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p style={{ margin: 0, color: "var(--text-soft)", textAlign: "center" }}>
            Pas de compte ?{" "}
            <a href="/register" style={{ color: "var(--gold)", textDecoration: "none" }}>
              Créer un compte
            </a>
          </p>
          <a className="nav-return-link" href="/">
  ← Retour
</a>
        </form>
      </div>
    </div>
  );
}