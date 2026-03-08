import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminSitesClient from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminSitesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminSitesClient />;
}