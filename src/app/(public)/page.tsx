// src/app/(public)/epreuves/page.tsx
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
  const res = await fetch("http://localhost:3000/api/epreuves", { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as EpreuveRow[];
}

export default async function EpreuvesPage() {
  const epreuves = await getEpreuves();
  return <EpreuvesClient initialEpreuves={epreuves} />;
}