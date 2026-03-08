import pool from "@/lib/db/pool";

export const dynamic = "force-dynamic";

type Sport = {
  id_sport: number;
  nom_sport: string;
};

type Epreuve = {
  id_epreuve: number;
  nom_epreuve: string;
  date_heure: string | Date;
  id_sport: number;
  nom_site?: string;
};

function parseDate(dt: string | Date) {
  const d =
    dt instanceof Date
      ? dt
      : new Date(dt.includes("T") ? dt : dt.replace(" ", "T"));

  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatDateTimeFr(value: string | Date) {
  const d =
    value instanceof Date
      ? value
      : new Date(value.includes("T") ? value : value.replace(" ", "T"));

  if (Number.isNaN(d.getTime())) return String(value);

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}

function isPast(value: string | Date) {
  const d =
    value instanceof Date
      ? value
      : new Date(value.includes("T") ? value : value.replace(" ", "T"));

  if (Number.isNaN(d.getTime())) return false;

  return d.getTime() < Date.now();
}

export default async function SportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idSport = Number(id);

  if (!id || Number.isNaN(idSport) || idSport <= 0) {
    return (
      <div className="section" style={{ paddingTop: 120 }}>
        <div className="section-header">
          <h2 className="section-title">
            SPORT <span>INTROUVABLE</span>
          </h2>
          <p className="section-subtitle">Identifiant invalide.</p>
        </div>
      </div>
    );
  }

  const [sportRows] = await pool.query(
    `
    SELECT id_sport, nom_sport
    FROM sport
    WHERE id_sport = :id_sport
    LIMIT 1
    `,
    { id_sport: idSport }
  );

  const sports = sportRows as Sport[];

  if (!sports.length) {
    return (
      <div className="section" style={{ paddingTop: 120 }}>
        <div className="section-header">
          <h2 className="section-title">
            SPORT <span>INTROUVABLE</span>
          </h2>
          <p className="section-subtitle">Ce sport n’existe pas.</p>
        </div>
      </div>
    );
  }

  const sport = sports[0];

  const [epreuveRows] = await pool.query(
    `
    SELECT
      e.id_epreuve,
      e.nom_epreuve,
      e.date_heure,
      e.id_sport,
      si.nom_site
    FROM epreuve e
    LEFT JOIN site si ON si.id_site = e.id_site
    WHERE e.id_sport = :id_sport
    ORDER BY e.date_heure ASC
    `,
    { id_sport: idSport }
  );

  const related = epreuveRows as Epreuve[];

  return (
    <section className="sport-detail-shell">
      <div className="sport-detail-page">
        <div className="sport-detail-hero">
          <div>
            <p className="sport-detail-kicker">Discipline olympique</p>
            <h1 className="sport-detail-title">
              {sport.nom_sport} <span>· épreuves liées</span>
            </h1>
            <p className="sport-detail-subtitle">
              Retrouvez toutes les compétitions liées à cette discipline et
              accédez aux fiches d’épreuves pour réserver vos billets.
            </p>
          </div>

          <a className="sport-detail-back-btn" href="/sports">
            ← Retour aux sports
          </a>
        </div>

        <div className="sport-detail-list">
          {related.length === 0 ? (
            <div className="sport-detail-empty">
              Aucune épreuve n’est encore rattachée à ce sport.
            </div>
          ) : (
            related.map((e) => {
              const past = isPast(e.date_heure);

              return (
                <article key={e.id_epreuve} className="sport-epreuve-card">
                  <div className="sport-epreuve-card-top">
                    <div className={`sport-epreuve-status ${past ? "past" : "future"}`}>
                      {past ? "Épreuve terminée" : "Réservation ouverte"}
                    </div>
                  </div>

                  <h3 className="sport-epreuve-title">{e.nom_epreuve}</h3>

                  <div className="sport-epreuve-meta">
                    <div>📅 {formatDateTimeFr(e.date_heure)}</div>
                    <div>📍 {e.nom_site ?? "Site à confirmer"}</div>
                  </div>

                  <div className="sport-epreuve-actions">
                    <a className="sport-epreuve-btn subtle" href={`/epreuves/${e.id_epreuve}`}>
                      Voir l’épreuve
                    </a>

                    {past ? (
                      <span className="sport-epreuve-btn disabled">
                        Épreuve passée
                      </span>
                    ) : (
                      <a className="sport-epreuve-btn solid" href={`/epreuves/${e.id_epreuve}`}>
                        Réserver
                      </a>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}