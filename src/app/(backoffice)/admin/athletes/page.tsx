import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminAthletesClient from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminAthletesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminAthletesClient />;
}