import AdminPaysClient from "./ui";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPaysPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login"); 

  return <AdminPaysClient />;
}