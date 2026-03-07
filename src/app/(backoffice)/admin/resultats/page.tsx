import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminResultatsClient from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminResultatsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminResultatsClient />;
}