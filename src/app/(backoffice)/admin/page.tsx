import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import pool from "@/lib/db/pool";

export const dynamic = "force-dynamic";

async function countTable(tableName: "sport" | "athlete" | "epreuve" | "billet") {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total FROM ${tableName}`
  );

  return Number((rows as any[])[0]?.total ?? 0);
}

export default async function AdminDashboardPage() {
  const me = await getSessionUser();
  if (!me) redirect("/login");

  const [sports, athletes, epreuves, billets] = await Promise.all([
    countTable("sport"),
    countTable("athlete"),
    countTable("epreuve"),
    countTable("billet"),
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