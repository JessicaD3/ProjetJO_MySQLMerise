import TicketsClient from "@/components/tickets/TicketsClient";

export const dynamic = "force-dynamic";

type TicketStat = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  nom_sport: string;
  nom_site: string;
  capacite: number;
  sold: number;
  remaining: number;
};

async function fetchJson<T>(path: string): Promise<T> {
  const base = process.env.APP_URL || "http://localhost:3000";
  const res = await fetch(new URL(path, base), { cache: "no-store" });
  if (!res.ok) return [] as any;
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as T;
}

export default async function TicketsPage() {
  const stats = await fetchJson<TicketStat[]>("/api/epreuves/billets/stats");
  return <TicketsClient stats={stats} />;
}