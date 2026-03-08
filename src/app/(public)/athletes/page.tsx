import AthletesClient from "@/components/athletes/AthletesClient";

export const dynamic = "force-dynamic";

type AthleteRow = {
  id_athlete: number;
  nom: string;
  prenom: string;
  sexe: string;
  id_pays: number;
  nom_pays: string;
};

async function fetchJson<T>(path: string): Promise<T> {
  const base = process.env.APP_URL || "http://localhost:3000";
  const res = await fetch(new URL(path, base), { cache: "no-store" });
  if (!res.ok) return [] as any;
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as T;
}

export default async function AthletesPage() {
  const athletes = await fetchJson<AthleteRow[]>("/api/public/athletes");
  return <AthletesClient athletes={athletes} />;
}