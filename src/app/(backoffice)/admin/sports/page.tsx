import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminSportsClient from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminSportsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminSportsClient />;
}