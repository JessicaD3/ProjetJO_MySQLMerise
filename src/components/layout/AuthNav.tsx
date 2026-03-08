"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Me = { login: string; nom_role: string };

export default function AuthNav() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    setLoading(true);
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.ok) setMe(json?.data ?? null);
    else setMe(null);
    setLoading(false);
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    window.location.href = "/";
  }

  if (loading) return null;

  if (!me) {
    return (
      <Link className="btn-login" href="/login">
        Connexion
      </Link>
    );
  }

  const isStaff = ["ADMIN", "ORGANISATEUR", "AGENT_BILLETTERIE"].includes(me.nom_role);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {isStaff ? (
        <Link className="btn-login" href="/admin">
          Dashboard
        </Link>
      ) : (
        <Link className="btn-login" href="/compte">
          Mon compte
        </Link>
      )}
      
      <button
        className="btn-login"
        style={{ background: "transparent", border: "2px solid var(--gold)", color: "var(--gold)" }}
        onClick={logout}
      >
        Déconnexion
      </button>
    </div>
  );
}