import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminParticipationsClient from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminParticipationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminParticipationsClient />;
}