import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminMedaillesClient from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminMedaillesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminMedaillesClient />;
}