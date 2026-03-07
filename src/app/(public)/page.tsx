import Hero from "@/components/home/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">EN DIRECT <span>DES JEUX</span></h2>
          <p className="section-subtitle">Suivez les dernières actualités et les résultats en temps réel</p>
        </div>

        <div className="filters">
          <button className="filter-btn active">Tous</button>
          <button className="filter-btn">En direct</button>
          <button className="filter-btn">Ski Alpin</button>
          <button className="filter-btn">Patinage</button>
          <button className="filter-btn">Hockey</button>
        </div>

        {/* Mock cards (on branchera l’API après) */}
        <div className="sports-grid">
          <div className="sport-card live">
            <div className="sport-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }} />
            <div className="sport-content">
              <div className="sport-category">Ski Alpin • En direct</div>
              <h3 className="sport-title">Descente hommes</h3>
              <div className="sport-details">
                <span>🏔️ Piste Olympia</span>
                <span>👥 15 athlètes</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: "75%" }} /></div>
              <div className="score-board">
                <div className="score">1:45.32</div>
                <div className="score-live">
                  <span>1. FRA</span>
                  <span>2. ITA +0.45</span>
                  <span>3. SUI +0.89</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sport-card live">
            <div className="sport-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516834611397-87ceb9e2f9a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }} />
            <div className="sport-content">
              <div className="sport-category">Patinage • En direct</div>
              <h3 className="sport-title">Programme court femmes</h3>
              <div className="sport-details">
                <span>⛸️ Palavela</span>
                <span>👥 12 participantes</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: "60%" }} /></div>
              <div className="score-board">
                <div className="score">78.45</div>
                <div className="score-live">
                  <span>1. RUS 78.45</span>
                  <span>2. USA 76.32</span>
                  <span>3. JPN 75.89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}