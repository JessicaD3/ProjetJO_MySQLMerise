import Hero from "@/components/home/Hero";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string;
  nom_sport?: string;
  nom_site?: string;
};

async function getEpreuvesTop(): Promise<Epreuve[]> {
  const res = await fetch("http://localhost:3000/api/epreuves", { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  const all = (json?.data ?? []) as Epreuve[];
  return all.slice(0, 3);
}

export default async function HomePage() {
  const top = await getEpreuvesTop();

  return (
    <>
      <Hero />

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">EN DIRECT <span>DES JEUX</span></h2>
          <p className="section-subtitle">Prochaines épreuves (chargées depuis la base)</p>
        </div>

        <div className="sports-grid">
          {top.length === 0 ? (
            <div style={{ color: "var(--text-soft)", textAlign: "center" }}>
              Aucune donnée pour le moment. Ajoute des épreuves dans la base ou vérifie l’API.
            </div>
          ) : (
            top.map((e) => (
              <Link key={e.id_epreuve} href={`/epreuves/${e.id_epreuve}`} className="sport-card">
                <div
                  className="sport-image"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
                  }}
                />
                <div className="sport-content">
                  <div className="sport-category">{e.nom_sport ?? "Épreuve"}</div>
                  <h3 className="sport-title">{e.nom_epreuve}</h3>
                  <div className="sport-details">
                    <span>📅 {e.date_heure}</span>
                    <span>🏟️ {e.nom_site ?? "-"}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}