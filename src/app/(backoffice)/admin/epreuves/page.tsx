import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminEpreuvesClient from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminEpreuvesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminEpreuvesClient />;
}