import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function count(path: string) {
  const base =
    process.env.APP_URL ||
    headers().get("origin") ||
    "http://localhost:3000";

  const url = new URL(path, base);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return 0;

  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) ? json.data.length : 0;
}

export default async function AdminDashboardPage() {
  const me = await getSessionUser();
  if (!me) redirect("/login");

  // Stats DB-driven (pas statiques)
const [sports, athletes, epreuves, billets] = await Promise.all([
  count("/api/sports"),
  count("/api/athletes"),
  count("/api/epreuves"),
  count("/api/billets"),
]);

  return (
    <>
      <div className="admin-topbar">
        <div className="page-title">
          <h1>Administration <span>JO 2026</span></h1>
        </div>
        <div className="topbar-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Rechercher..." />
          </div>
          <div className="notification-badge">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-skiing"></i></div>
          <div className="stat-content"><h3>{sports}</h3><p>Sports</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-users"></i></div>
          <div className="stat-content"><h3>{athletes}</h3><p>Athlètes</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-calendar-alt"></i></div>
          <div className="stat-content"><h3>{epreuves}</h3><p>Épreuves</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-ticket-alt"></i></div>
          <div className="stat-content"><h3>{billets}</h3><p>Billets vendus</p></div>
        </div>
      </div>

      <div className="quick-actions">
        <a className="quick-action-card" href="/admin/epreuves">
          <i className="fas fa-plus-circle"></i>
          <h4>Créer une épreuve</h4>
          <p>Ajouter une compétition</p>
        </a>
        <a className="quick-action-card" href="/admin/resultats">
          <i className="fas fa-stopwatch"></i>
          <h4>Saisir résultats</h4>
          <p>Temps + classement</p>
        </a>
        <a className="quick-action-card" href="/admin/medailles">
          <i className="fas fa-medal"></i>
          <h4>Attribuer médailles</h4>
          <p>OR/ARGENT/BRONZE</p>
        </a>
        <a className="quick-action-card" href="/admin/billetterie">
          <i className="fas fa-ticket-alt"></i>
          <h4>Billetterie</h4>
          <p>Vendre / contrôler capacité</p>
        </a>
      </div>
    </>
  );
}