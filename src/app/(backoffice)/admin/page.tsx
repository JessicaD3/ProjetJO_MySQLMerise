import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const me = await getSessionUser();
  if (!me) redirect("/login");

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="section-header">
        <h2 className="section-title">
          DASHBOARD <span>ADMIN</span>
        </h2>
        <p className="section-subtitle">
          Connecté : <strong>{me.login}</strong> — rôle : <strong>{me.nom_role}</strong>
        </p>
      </div>

      <div className="filters" style={{ marginBottom: 20 }}>
        <Link className="filter-btn" href="/admin/pays">Gérer Pays</Link>
        <Link className="filter-btn" href="/admin/epreuves">Gérer Épreuves</Link>
        <Link className="filter-btn" href="/admin/billetterie">Billetterie</Link>
        <LogoutButton />
      </div>

      <div className="medals-table" style={{ padding: 20 }}>
        <p style={{ color: "var(--text-soft)" }}>
          Prochaine étape : brancher chaque page admin (pays/sports/sites/...) sur les endpoints CRUD.
        </p>
      </div>
    </div>
  );
}