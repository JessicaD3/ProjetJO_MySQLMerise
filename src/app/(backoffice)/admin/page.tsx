import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Overview = {
  sports: number;
  athletes: number;
  epreuves: number;
};

type Summary = {
  ticketsSold: number;
  revenue: number;
  avgFillRate: number;
  medalCountries: number;
};

type SalesOverTimeItem = {
  date_complete: string;
  nb_billets: number | string;
  ca: number | string;
};

type RevenueBySportItem = {
  nom_sport: string;
  chiffre_affaires: number | string;
};

type TopEventItem = {
  nom_epreuve: string;
  billets_vendus: number | string;
  ca: number | string;
};

type RecentSaleItem = {
  id_billet: number;
  nom: string;
  prenom: string;
  prix_achat: number | string;
  date_achat: string;
  nom_epreuve: string;
};

type Insights = {
  forecastTomorrow: number;
  bestSport: {
    nom_sport: string;
    chiffre_affaires: number | string;
  } | null;
  bestSite: {
    nom_site: string;
    fill_rate: number | string;
  } | null;
};

type AnalyticsResponse = {
  overview: Overview;
  summary: Summary;
  salesOverTime: SalesOverTimeItem[];
  revenueBySport: RevenueBySportItem[];
  topEvents: TopEventItem[];
  recentSales: RecentSaleItem[];
  insights: Insights;
};

async function getAnalytics(): Promise<AnalyticsResponse> {
  const base = process.env.APP_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/admin/analytics`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Impossible de charger les analytics");
  }

  return res.json();
}

function formatCurrency(value: number | string) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(num);
}

function formatNumber(value: number | string) {
  return new Intl.NumberFormat("fr-FR").format(Number(value || 0));
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const me = await getSessionUser();
  if (!me) redirect("/login");

  const data = await getAnalytics();

  const maxSportRevenue = Math.max(
    ...data.revenueBySport.map((item) => Number(item.chiffre_affaires || 0)),
    1
  );

  const maxEventTickets = Math.max(
    ...data.topEvents.map((item) => Number(item.billets_vendus || 0)),
    1
  );

  return (
    <>
      <div className="admin-topbar">
        <div className="page-title">
          <h1>
            Administration <span>JO 2026</span>
          </h1>
          <p className="analytics-subtitle admin-dashboard-subtitle">
            Tableau de bord analytique basé sur les ventes, les sports, les
            épreuves et les médailles.
          </p>
        </div>

        <div className="topbar-actions">
          <div className="analytics-status">
            <span className="status-dot" />
            Data Warehouse actif
          </div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{data.overview.athletes}</h3>
            <p>Athlètes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-skiing"></i>
          </div>
          <div className="stat-content">
            <h3>{data.overview.sports}</h3>
            <p>Sports</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{data.overview.epreuves}</h3>
            <p>Épreuves</p>
          </div>
        </div>
      </div>

      <section className="kpi-grid">
        <article className="kpi-card">
          <p className="kpi-label">Billets vendus</p>
          <h2>{formatNumber(data.summary.ticketsSold)}</h2>
          <span className="kpi-note">Total consolidé OLAP</span>
        </article>

        <article className="kpi-card">
          <p className="kpi-label">Chiffre d’affaires</p>
          <h2>{formatCurrency(data.summary.revenue)}</h2>
          <span className="kpi-note">Ventes totales billets</span>
        </article>

        <article className="kpi-card">
          <p className="kpi-label">Taux moyen de remplissage</p>
          <h2>{data.summary.avgFillRate.toFixed(2)}%</h2>
          <span className="kpi-note">Moyenne sur les épreuves</span>
        </article>

        <article className="kpi-card">
          <p className="kpi-label">Pays médaillés</p>
          <h2>{formatNumber(data.summary.medalCountries)}</h2>
          <span className="kpi-note">Pays avec au moins une médaille</span>
        </article>
      </section>

      <section className="analytics-grid analytics-grid-main">
        <article className="panel panel-large">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Tendance</p>
              <h3>Ventes dans le temps</h3>
            </div>
          </div>

          <div className="timeline-list">
            {data.salesOverTime.length === 0 ? (
              <p className="empty-state">Aucune donnée disponible.</p>
            ) : (
              data.salesOverTime.map((item, index) => (
                <div
                  className="timeline-row"
                  key={`${item.date_complete}-${index}`}
                >
                  <div>
                    <p className="timeline-title">
                      {formatDate(item.date_complete)}
                    </p>
                    <p className="timeline-subtitle">
                      {formatNumber(item.nb_billets)} billet(s)
                    </p>
                  </div>
                  <strong>{formatCurrency(item.ca)}</strong>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Répartition</p>
              <h3>CA par sport</h3>
            </div>
          </div>

          <div className="bar-list">
            {data.revenueBySport.length === 0 ? (
              <p className="empty-state">Aucune donnée disponible.</p>
            ) : (
              data.revenueBySport.map((item) => {
                const value = Number(item.chiffre_affaires || 0);
                const width = Math.max((value / maxSportRevenue) * 100, 6);

                return (
                  <div className="bar-row" key={item.nom_sport}>
                    <div className="bar-row-top">
                      <span>{item.nom_sport}</span>
                      <strong>{formatCurrency(value)}</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>

      <section className="analytics-grid analytics-grid-secondary">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Classement</p>
              <h3>Top épreuves</h3>
            </div>
          </div>

          <div className="bar-list">
            {data.topEvents.length === 0 ? (
              <p className="empty-state">Aucune donnée disponible.</p>
            ) : (
              data.topEvents.map((item) => {
                const sold = Number(item.billets_vendus || 0);
                const width = Math.max((sold / maxEventTickets) * 100, 6);

                return (
                  <div className="bar-row" key={item.nom_epreuve}>
                    <div className="bar-row-top">
                      <span>{item.nom_epreuve}</span>
                      <strong>{formatNumber(sold)} billets</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill gold-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <small className="row-meta">
                      {formatCurrency(item.ca)}
                    </small>
                  </div>
                );
              })
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Billetterie</p>
              <h3>Derniers achats</h3>
            </div>
          </div>

          <div className="sales-list">
            {data.recentSales.length === 0 ? (
              <p className="empty-state">Aucun achat disponible.</p>
            ) : (
              data.recentSales.map((sale) => (
                <div className="sale-row" key={sale.id_billet}>
                  <div>
                    <p className="sale-buyer">
                      {sale.prenom} {sale.nom}
                    </p>
                    <p className="sale-event">{sale.nom_epreuve}</p>
                    <small>{formatDate(sale.date_achat)}</small>
                  </div>
                  <strong>{formatCurrency(sale.prix_achat)}</strong>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="insights-grid">
        <article className="insight-card">
          <p className="insight-label">Prévision simple J+1</p>
          <h3>{formatNumber(data.insights.forecastTomorrow)}</h3>
          <span>Billets estimés selon la moyenne journalière</span>
        </article>

        <article className="insight-card">
          <p className="insight-label">Sport le plus rentable</p>
          <h3>{data.insights.bestSport?.nom_sport ?? "N/A"}</h3>
          <span>
            {data.insights.bestSport
              ? formatCurrency(data.insights.bestSport.chiffre_affaires)
              : "Aucune donnée"}
          </span>
        </article>

        <article className="insight-card">
          <p className="insight-label">Site le plus rempli</p>
          <h3>{data.insights.bestSite?.nom_site ?? "N/A"}</h3>
          <span>
            {data.insights.bestSite
              ? `${Number(data.insights.bestSite.fill_rate).toFixed(2)}%`
              : "Aucune donnée"}
          </span>
        </article>
      </section>
    </>
  );
}