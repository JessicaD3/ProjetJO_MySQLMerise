import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { getSessionUser } from "@/lib/auth/session";

function canAccessBackoffice(role: string) {
  return ["ADMIN", "ORGANISATEUR", "AGENT_BILLETTERIE"].includes(role);
}

export default async function BackofficeLayout({ children }: { children: ReactNode }) {
  const me = await getSessionUser();

  if (!me) redirect("/login");

  if (!canAccessBackoffice(me.nom_role)) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">
            Accès <span>refusé</span>
          </h2>
          <p className="section-subtitle">
            Votre rôle ({me.nom_role}) ne permet pas d’accéder au backoffice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNav role={me.nom_role} />
      {children}
    </>
  );
}