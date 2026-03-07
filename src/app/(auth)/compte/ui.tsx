"use client";

import { useEffect, useState } from "react";

type Stats = {
  ticketsCount: number;
  totalSpent: number;
  upcomingEvents: number;
  recentInvoices: any[];
  upcomingTickets: any[];
};

export default function UserDashboardClient({ login, role }: { login: string; role: string }) {
  const [tab, setTab] = useState<"dashboard" | "billets" | "profil">("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function loadStats() {
    const res = await fetch("/api/mon-espace/stats", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.details ?? json?.error ?? "Erreur");
    return json.data as Stats;
  }

  async function loadMyTickets() {
    const res = await fetch("/api/mes-billets", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.details ?? json?.error ?? "Erreur");
    return (json.data ?? []) as any[];
  }

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const s = await loadStats();
        setStats(s);
      } catch (e: any) {
        setErr(e?.message ?? "Erreur");
      }
    })();
  }, []);

  async function openBillets() {
    setTab("billets");
    try {
      setErr(null);
      const t = await loadMyTickets();
      setMyTickets(t);
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  const avatar = (login?.[0] ?? "U").toUpperCase();

  return (
    <div className="userdash-wrapper">
      <aside className="userdash-sidebar">
        <div className="userdash-brand">
          MILAN<span>CORTINA</span>
        </div>

        <div className="userdash-user">
          <div className="userdash-avatar">{avatar}</div>
          <div>
            <div><strong>{login}</strong></div>
            <small>{role}</small>
          </div>
        </div>

        <ul className="userdash-nav">
          <li>
            <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
              Tableau de bord <span>›</span>
            </button>
          </li>
          <li>
            <button className={tab === "profil" ? "active" : ""} onClick={() => setTab("profil")}>
              Mon profil <span>›</span>
            </button>
          </li>
        </ul>

        <button className="userdash-logout" onClick={logout}>Déconnexion</button>
      </aside>

      <main className="userdash-main">
        <div className="userdash-topbar">
          <div className="userdash-title">
            <h1>Mon <span>Espace</span></h1>
            <p>Gérez vos billets et consultez vos achats.</p>
          </div>
        </div>

        {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

        {tab === "dashboard" && (
          <>
            <div className="userdash-cards">
              <div className="userdash-card">
                <h3>{stats?.ticketsCount ?? "—"}</h3>
                <p>Billets achetés</p>
              </div>
              <div className="userdash-card">
                <h3>{stats ? `${stats.totalSpent}€` : "—"}</h3>
                <p>Total dépensé</p>
              </div>
              <div className="userdash-card">
                <h3>{stats?.upcomingEvents ?? "—"}</h3>
                <p>Événements à venir</p>
              </div>
            </div>

            <div className="userdash-grid">
              <div className="userdash-card">
                <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-dark)" }}>Dernières factures</h3>
                <div className="userdash-list" style={{ marginTop: 12 }}>
                  {(stats?.recentInvoices ?? []).length === 0 ? (
                    <div className="userdash-item">
                      <div>
                        <strong>Aucune facture</strong>
                        <div><small>Vous n’avez pas encore acheté de billet.</small></div>
                      </div>
                      <div className="userdash-pill">—</div>
                    </div>
                  ) : (
                    stats!.recentInvoices.map((b: any) => (
                      <a
                        key={b.id_billet}
                        href={`/billets/${b.id_billet}`}
                        style={{ textDecoration: "none" }}
                        className="userdash-item"
                      >
                        <div>
                          <strong>Billet #{b.id_billet}</strong>
                          <div><small>{b.date_achat} • Place {b.num_place}</small></div>
                        </div>
                        <div className="userdash-pill">{b.prix_achat}€</div>
                      </a>
                    ))
                  )}
                </div>
              </div>

              <div className="userdash-card">
                <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-dark)" }}>Prochains événements</h3>
                <div className="userdash-list" style={{ marginTop: 12 }}>
                  {(stats?.upcomingTickets ?? []).length === 0 ? (
                    <div className="userdash-item">
                      <div>
                        <strong>Aucun événement à venir</strong>
                        <div><small>Vos prochains billets apparaîtront ici.</small></div>
                      </div>
                      <div className="userdash-pill">—</div>
                    </div>
                  ) : (
                    stats!.upcomingTickets.map((t: any) => (
                      <a
                        key={t.id_billet}
                        href={`/epreuves/${t.id_epreuve}`}
                        style={{ textDecoration: "none" }}
                        className="userdash-item"
                      >
                        <div>
                          <strong>{t.nom_epreuve}</strong>
                          <div><small>{t.date_heure} • Billet #{t.id_billet}</small></div>
                        </div>
                        <div className="userdash-pill">{t.num_place}</div>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "billets" && (
          <div className="userdash-card">
            <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-dark)" }}>Mes billets</h3>
            <div className="userdash-list" style={{ marginTop: 12 }}>
              {myTickets.length === 0 ? (
                <div className="userdash-item">
                  <div>
                    <strong>Aucun billet</strong>
                    <div><small>Vous n’avez pas encore acheté de billet.</small></div>
                  </div>
                  <div className="userdash-pill">—</div>
                </div>
              ) : (
                myTickets.map((b: any) => (
                  <a
                    key={b.id_billet}
                    href={`/billets/${b.id_billet}`}
                    style={{ textDecoration: "none" }}
                    className="userdash-item"
                  >
                    <div>
                      <strong>Billet #{b.id_billet}</strong>
                      <div><small>{b.date_achat} • Épreuve #{b.id_epreuve} • Place {b.num_place}</small></div>
                    </div>
                    <div className="userdash-pill">{b.prix_achat}€</div>
                  </a>
                ))
              )}
            </div>
          </div>
        )}

        {tab === "profil" && (
          <div className="userdash-card">
            <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-dark)" }}>Mon profil</h3>
            <div className="userdash-list" style={{ marginTop: 12 }}>
              <div className="userdash-item">
                <div>
                  <strong>Login</strong>
                  <div><small>{login}</small></div>
                </div>
                <div className="userdash-pill">{role}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}