import CalendrierClient from "@/components/calendrier/CalendrierClient";

export const dynamic = "force-dynamic";

type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  nom_site?: string;
  nom_sport?: string;
  id_site?: number;
  id_sport?: number;
};

async function fetchJson<T>(path: string): Promise<T> {
  const base = process.env.APP_URL || "http://localhost:3000";
  const res = await fetch(new URL(path, base), { cache: "no-store" });
  if (!res.ok) return [] as any;
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as T;
}

export default async function CalendrierPage() {
  const epreuves = await fetchJson<Epreuve[]>("/api/epreuves");
  return <CalendrierClient epreuves={epreuves} />;
}