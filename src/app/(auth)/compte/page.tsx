import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const user = await getSessionUser();

  // Option la plus claire : rediriger vers login si pas connecté
  if (!user) redirect("/login");

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">
          MON <span>COMPTE</span>
        </h2>
        <p className="section-subtitle">Profil utilisateur</p>
      </div>

      <div className="medals-table" style={{ padding: 20 }}>
        <p><strong>Login :</strong> {user.login}</p>
        <p><strong>Rôle :</strong> {user.nom_role}</p>
      </div>
    </div>
  );
}