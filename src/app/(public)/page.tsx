import Hero from "@/components/home/Hero";
import HomeUpcomingEvents from "@/components/home/HomeUpcomingEvents";

export const dynamic = "force-dynamic";

type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string | Date;
  nom_sport?: string;
  nom_site?: string;
};

async function fetchJson<T>(path: string): Promise<T> {
  const base = process.env.APP_URL || "http://localhost:3000";
  const res = await fetch(new URL(path, base), { cache: "no-store" });
  if (!res.ok) return [] as T;
  const json = await res.json().catch(() => null);
  return (json?.data ?? []) as T;
}

function parseDate(dt: string | Date) {
  const d =
    dt instanceof Date
      ? dt
      : new Date(dt.includes("T") ? dt : dt.replace(" ", "T"));

  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export default async function HomePage() {
  const epreuves = await fetchJson<Epreuve[]>("/api/epreuves");

  const upcoming = [...epreuves]
    .filter((e) => {
      const d = parseDate(e.date_heure);
      return d && d.getTime() > Date.now();
    })
    .sort((a, b) => {
      const da = parseDate(a.date_heure)?.getTime() ?? 0;
      const db = parseDate(b.date_heure)?.getTime() ?? 0;
      return da - db;
    })
    .slice(0, 4);

  return (
    <>
      <Hero />
      <HomeUpcomingEvents epreuves={upcoming} />
    </>
  );
}