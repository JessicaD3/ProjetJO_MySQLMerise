export const dynamic = "force-dynamic";

type MedalRow = {
  rang: number;
  nom_pays: string;
  or: number;
  argent: number;
  bronze: number;
  total: number;
};

function getFlagFromCountryName(country?: string) {
  const value = (country ?? "").toLowerCase().trim();

  const map: Record<string, string> = {
    france: "🇫🇷",
    italie: "🇮🇹",
    suisse: "🇨🇭",
    "états-unis": "🇺🇸",
    "etats-unis": "🇺🇸",
    canada: "🇨🇦",
    norvège: "🇳🇴",
    norvege: "🇳🇴",
    suède: "🇸🇪",
    suede: "🇸🇪",
    finlande: "🇫🇮",
    autriche: "🇦🇹",
    allemagne: "🇩🇪",
    slovaquie: "🇸🇰",
    slovénie: "🇸🇮",
    slovenie: "🇸🇮",
    liechtenstein: "🇱🇮",
    japon: "🇯🇵",
    chine: "🇨🇳",
    corée: "🇰🇷",
    "corée du sud": "🇰🇷",
    "coree du sud": "🇰🇷",
  };

  return map[value] ?? "🏳️";
}

export default async function MedaillesPage() {
  const base = process.env.APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/classement/medailles`, {
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({ data: [] }));
  const rows = (json.data ?? []) as MedalRow[];

  const leader = rows[0] ?? null;
  const totalGold = rows.reduce((sum, r) => sum + Number(r.or ?? 0), 0);
  const totalSilver = rows.reduce((sum, r) => sum + Number(r.argent ?? 0), 0);
  const totalBronze = rows.reduce((sum, r) => sum + Number(r.bronze ?? 0), 0);
  const totalMedals = rows.reduce((sum, r) => sum + Number(r.total ?? 0), 0);

  return (
    <section className="medals-premium-shell">
      <div className="medals-premium-page">
        <div className="medals-premium-hero">
          <div className="medals-premium-hero-left">
            <p className="medals-premium-kicker">Classement officiel</p>
            <h1 className="medals-premium-title">
              Tableau des <span>médailles</span>
            </h1>
            <p className="medals-premium-subtitle">
              Classement des nations calculé à partir des résultats enregistrés
              dans le système officiel des Jeux.
            </p>
          </div>

          <div className="medals-premium-badge">
            <span className="medals-premium-badge-icon">🏅</span>
            <div>
              <strong>{rows.length}</strong>
              <p>nation(s) classée(s)</p>
            </div>
          </div>
        </div>

        <div className="medals-premium-info-grid">
          <div className="medals-rule-banner">
            <div className="medals-rule-badge">Règle officielle</div>
            <p>
              <strong>Classement par nombre de médailles d'or</strong> (puis argent, puis bronze).
              En cas d'égalité parfaite, les nations sont à égalité et partagent le rang.
              C'est la méthode appliquée par le CIO depuis 2020.
            </p>
          </div>

          <div className="medals-highlight-card">
            <p className="medals-card-kicker">Nation en tête</p>
            {leader ? (
              <>
                <h3>
                  <span className="medals-flag">{getFlagFromCountryName(leader.nom_pays)}</span>
                  {leader.nom_pays}
                </h3>
                <p>
                  Rang #{leader.rang} · {leader.or} or · {leader.argent} argent ·{" "}
                  {leader.bronze} bronze
                </p>
              </>
            ) : (
              <>
                <h3>Aucune nation classée</h3>
                <p>Le tableau se remplira au fur et à mesure des attributions.</p>
              </>
            )}
          </div>

          <div className="medals-summary-card">
            <div className="medals-summary-item">
              <span>🥇</span>
              <strong>{totalGold}</strong>
              <p>Or</p>
            </div>
            <div className="medals-summary-item">
              <span>🥈</span>
              <strong>{totalSilver}</strong>
              <p>Argent</p>
            </div>
            <div className="medals-summary-item">
              <span>🥉</span>
              <strong>{totalBronze}</strong>
              <p>Bronze</p>
            </div>
            <div className="medals-summary-item total">
              <span>🏅</span>
              <strong>{totalMedals}</strong>
              <p>Total</p>
            </div>
          </div>
        </div>

        <div className="medals-premium-table-wrap">
          <div className="medals-premium-table-head">
            <div>Rang</div>
            <div>Pays</div>
            <div>🥇 Or</div>
            <div>🥈 Argent</div>
            <div>🥉 Bronze</div>
            <div>Total</div>
          </div>

          <div className="medals-premium-table-body">
            {rows.length === 0 ? (
              <div className="medals-premium-empty">
                Aucune médaille attribuée pour le moment.
              </div>
            ) : (
              rows.map((m, index) => (
                <div
                  className={[
                    "medals-premium-row",
                    index === 0 ? "is-first" : "",
                    index === 1 ? "is-second" : "",
                    index === 2 ? "is-third" : "",
                  ].join(" ")}
                  key={m.nom_pays}
                >
                  <div className="medals-rank-cell">
                    <span className="medals-rank-badge">#{m.rang}</span>
                  </div>

                  <div className="medals-country-cell">
                    <span className="medals-country-flag">
                      {getFlagFromCountryName(m.nom_pays)}
                    </span>
                    <span className="medals-country-name">{m.nom_pays}</span>
                  </div>

                  <div className="medals-gold-cell">{m.or}</div>
                  <div className="medals-silver-cell">{m.argent}</div>
                  <div className="medals-bronze-cell">{m.bronze}</div>
                  <div className="medals-total-cell">{m.total}</div>
                </div>
              ))
            )}
          </div>
          <div className="medals-info-box">
          <div className="medals-info-line">
            <span className="medals-info-icon">ⓘ</span>
            <span>Classement officiel : priorité à l'or, puis à l'argent, puis au bronze.</span>
          </div>

          <div className="medals-info-line">
            <span className="medals-info-icon">🏅</span>
            <span>En cas d'égalité parfaite, même rang (ex. Japon et Chine 11e).</span>
          </div>
        </div>
        </div>

      </div>
    </section>
  );
}