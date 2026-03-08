"use client";

import { useMemo, useState } from "react";

type Athlete = {
  id_athlete: number;
  nom: string;
  prenom: string;
  sexe: string;
  id_pays?: number;
  nom_pays?: string;
};

function getInitials(prenom: string, nom: string) {
  return `${prenom?.trim()?.[0] ?? ""}${nom?.trim()?.[0] ?? ""}`.toUpperCase();
}

function getSexLabel(sexe?: string) {
  const s = (sexe ?? "").toUpperCase();
  if (s === "M") return "Homme";
  if (s === "F") return "Femme";
  return "Non précisé";
}

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
    "coree du sud": "🇰🇷",
    "corée du sud": "🇰🇷",
  };

  return map[value] ?? "🏁";
}

export default function AthletesClient({ athletes }: { athletes: Athlete[] }) {
  const [searchName, setSearchName] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [sexFilter, setSexFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const countries = useMemo(() => {
    const unique = Array.from(
      new Set(
        athletes
          .map((a) => a.nom_pays?.trim())
          .filter((v): v is string => Boolean(v))
      )
    );

    return unique.sort((a, b) => a.localeCompare(b, "fr"));
  }, [athletes]);

  const filteredAthletes = useMemo(() => {
    const term = searchName.trim().toLowerCase();

    return athletes.filter((ath) => {
      const fullName = `${ath.prenom} ${ath.nom}`.toLowerCase();
      const matchesName = !term || fullName.includes(term);

      const athleteSex = (ath.sexe ?? "").toUpperCase();
      const matchesSex = sexFilter === "all" || athleteSex === sexFilter;

      const athleteCountry = ath.nom_pays?.trim() ?? "";
      const matchesCountry =
        countryFilter === "all" || athleteCountry === countryFilter;

      return matchesName && matchesSex && matchesCountry;
    });
  }, [athletes, searchName, sexFilter, countryFilter]);

  function applyFilters() {
    setSearchName(draftSearch);
  }

  function clearFilters() {
    setDraftSearch("");
    setSearchName("");
    setSexFilter("all");
    setCountryFilter("all");
  }

  return (
    <section className="athletes-premium-shell">
      <div className="athletes-premium-page">
        <div className="athletes-page-header">
          <div>
            <h1>
              Tous les athlètes <span>Milan 2026</span>
            </h1>
            <p className="athletes-page-subtitle">
              Consultez les athlètes enregistrés dans le système officiel des Jeux.
            </p>
          </div>

          <div className="athletes-stats-badge">
            <i>⛷️</i>
            <span>{filteredAthletes.length}</span> athlète(s)
          </div>
        </div>

        <div className="athletes-filters-section">
          <div className="athletes-filter-group">
            <label>🔍 Rechercher par nom</label>
            <input
              type="text"
              className="athletes-filter-field"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              placeholder="ex: Pinturault, Goggia..."
              autoComplete="off"
            />
          </div>

          <div className="athletes-filter-group athletes-filter-group-select">
            <label>⚥ Sexe</label>
            <select
              className="athletes-filter-field"
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="M">Hommes</option>
              <option value="F">Femmes</option>
            </select>
          </div>

          <div className="athletes-filter-group athletes-filter-group-select">
            <label>🌍 Pays</label>
            <select
              className="athletes-filter-field"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <option value="all">Tous les pays</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="athletes-filter-actions">
            <button className="athletes-btn-clear" type="button" onClick={clearFilters}>
              Effacer
            </button>
            <button className="athletes-btn-apply" type="button" onClick={applyFilters}>
              Appliquer
            </button>
          </div>
        </div>

        <div className="athletes-grid-premium">
          {filteredAthletes.length === 0 ? (
            <div className="athletes-no-result">
              ❄️ Aucun athlète ne correspond aux filtres
            </div>
          ) : (
            filteredAthletes.map((ath) => {
              const flag = getFlagFromCountryName(ath.nom_pays);
              const initials = getInitials(ath.prenom, ath.nom);

              return (
                <article key={ath.id_athlete} className="athlete-premium-card">
                  <div className="athlete-premium-photo">
                    <div className="athlete-premium-avatar">{initials}</div>
                    <div className="athlete-premium-flag">{flag}</div>
                  </div>

                  <div className="athlete-premium-info">
                    <div className="athlete-premium-name">
                      {ath.prenom} {ath.nom}
                    </div>

                    <div className="athlete-premium-country">
                      {flag} {ath.nom_pays ?? "Pays non renseigné"}
                    </div>

                    <div className="athlete-premium-meta">
                      <span className="athlete-meta-item">
                        <span className="athlete-sex-badge">
                          {getSexLabel(ath.sexe)}
                        </span>
                      </span>
                    </div>
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