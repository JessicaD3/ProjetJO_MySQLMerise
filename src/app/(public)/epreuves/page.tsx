import EpreuvesClient from "@/components/epreuves/EpreuvesClient";

export const dynamic = "force-dynamic";

type EpreuveRow = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  id_sport: number;
  nom_sport: string;
  id_site: number;
  nom_site: string;
};

async function getEpreuves(): Promise<EpreuveRow[]> {
  const base = process.env.APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/epreuves`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as EpreuveRow[];
}

export default async function EpreuvesPage() {
  const epreuves = await getEpreuves();
  return <EpreuvesClient initialEpreuves={epreuves} />;
}