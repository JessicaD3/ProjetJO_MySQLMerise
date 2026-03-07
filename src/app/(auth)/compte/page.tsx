import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import "./user.css";
import UserDashboardClient from "./ui";

export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // Si staff => dashboard admin
  if (user.nom_role !== "LECTEUR") redirect("/admin");

  return <UserDashboardClient login={user.login} role={user.nom_role} />;
}