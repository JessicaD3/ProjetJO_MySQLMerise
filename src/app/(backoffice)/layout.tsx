// src/app/(backoffice)/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

import AdminSidebar from "./admin/AdminSidebar";
import "./admin/admin.css";

function canAccessBackoffice(role: string) {
  return ["ADMIN", "ORGANISATEUR", "AGENT_BILLETTERIE"].includes(role);
}

export default async function BackofficeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  if (!canAccessBackoffice(me.nom_role)) redirect("/");

  return (
    <div className="admin-wrapper">
      <AdminSidebar login={me.login} role={me.nom_role} />
      <main className="admin-main">{children}</main>
    </div>
  );
}