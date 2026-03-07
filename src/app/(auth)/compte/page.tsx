export default async function ComptePage() {
  // Server Component: lit /api/auth/me côté serveur (cookie httpOnly)
  const res = await fetch("http://localhost:3000/api/auth/me", { cache: "no-store" }).catch(() => null);

  if (!res || !res.ok) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">MON <span>COMPTE</span></h2>
          <p className="section-subtitle">Vous n’êtes pas connecté.</p>
        </div>
      </div>
    );
  }

  const { data } = await res.json();

  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">MON <span>COMPTE</span></h2>
        <p className="section-subtitle">Profil (temporaire) — on fera un dashboard plus tard</p>
      </div>

      <div className="medals-table" style={{ padding: 20 }}>
        <p><strong>Login :</strong> {data.login}</p>
        <p><strong>Rôle :</strong> {data.nom_role}</p>
      </div>
    </div>
  );
}