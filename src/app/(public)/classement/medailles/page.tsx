export default async function MedaillesPage() {
  const base = process.env.APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/classement/medailles`, {
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({ data: [] }));
  const rows = (json.data ?? []) as Array<{
    rang: number;
    nom_pays: string;
    or: number;
    argent: number;
    bronze: number;
    total: number;
  }>;

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">
          TABLEAU DES <span>MÉDAILLES</span>
        </h2>
        <p className="section-subtitle">Classement officiel des nations (calculé en temps réel)</p>
      </div>

      <div className="medals-table">
        <div className="medals-header">
          <div>Rang</div>
          <div>Pays</div>
          <div>🥇 Or</div>
          <div>🥈 Argent</div>
          <div>🥉 Bronze</div>
          <div>Total</div>
        </div>

        {rows.map((m) => (
          <div className="medal-row" key={m.nom_pays}>
            <div>{m.rang}</div>
            <div>{m.nom_pays}</div>
            <div className="gold">{m.or}</div>
            <div className="silver">{m.argent}</div>
            <div className="bronze">{m.bronze}</div>
            <div className="gold">{m.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}