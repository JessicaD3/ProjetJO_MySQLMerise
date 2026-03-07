import Link from "next/link";

export default function EpreuvesPage() {
  return (
    <div className="section" style={{ paddingTop: 140 }}>
      <div className="section-header">
        <h2 className="section-title">TOUTES LES <span>ÉPREUVES</span></h2>
        <p className="section-subtitle">Liste (mock) — on branchera ensuite sur l’API /api/epreuves</p>
      </div>

      <div className="sports-grid">
        <Link href="/epreuves/1" className="sport-card">
          <div className="sport-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }} />
          <div className="sport-content">
            <div className="sport-category">Ski Alpin</div>
            <h3 className="sport-title">Descente hommes</h3>
            <div className="sport-details">
              <span>📅 15 fév.</span>
              <span>🏟️ Piste Olympia</span>
            </div>
          </div>
        </Link>

        <Link href="/epreuves/2" className="sport-card">
          <div className="sport-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516834611397-87ceb9e2f9a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }} />
          <div className="sport-content">
            <div className="sport-category">Patinage</div>
            <h3 className="sport-title">Danse sur glace</h3>
            <div className="sport-details">
              <span>📅 19 fév.</span>
              <span>🏟️ Palavela</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}