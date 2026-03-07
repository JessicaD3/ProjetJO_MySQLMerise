import Link from "next/link";

export default function AdminNav({ role }: { role: string }) {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 50px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <strong style={{ color: "var(--gold)" }}>Backoffice</strong>{" "}
          <span style={{ color: "var(--text-soft)" }}>({role})</span>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="filter-btn" href="/admin">Dashboard</Link>
          <Link className="filter-btn" href="/admin/pays">Pays</Link>
          <Link className="filter-btn" href="/admin/sports">Sports</Link>
          <Link className="filter-btn" href="/admin/sites">Sites</Link>
          <Link className="filter-btn" href="/admin/athletes">Athlètes</Link>
          <Link className="filter-btn" href="/admin/epreuves">Épreuves</Link>
          <Link className="filter-btn" href="/admin/participations">Participations</Link>
          <Link className="filter-btn" href="/admin/resultats">Résultats</Link>
          <Link className="filter-btn" href="/admin/medailles">Médailles</Link>
          <Link className="filter-btn" href="/admin/billetterie">Billetterie</Link>
        </div>
      </div>
    </div>
  );
}