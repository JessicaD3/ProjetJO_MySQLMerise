import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import pool from "@/lib/db/pool";
import { apiError } from "@/lib/http/errors";
import PrintInvoiceButton from "@/components/tickets/PrintInvoiceButton";

export const dynamic = "force-dynamic";

type BilletDetail = {
  id_billet: number;
  id_epreuve: number;
  id_utilisateur: number;
  nom: string;
  prenom: string;
  date_achat: string | Date;
  num_place: string;
  prix_achat: number;
  nom_epreuve: string;
  date_heure: string | Date;
  nom_sport: string;
  nom_site: string;
};

function formatDateFr(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateShortFr(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function getInitials(prenom: string, nom: string) {
  return `${prenom?.trim()?.[0] ?? ""}${nom?.trim()?.[0] ?? ""}`.toUpperCase();
}

function buildInvoiceRef(idBillet: number, dateAchat: string | Date) {
  const d = dateAchat instanceof Date ? dateAchat : new Date(dateAchat);

  if (Number.isNaN(d.getTime())) {
    return `INV-${idBillet}`;
  }

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `INV-${yyyy}${mm}${dd}-${String(idBillet).padStart(4, "0")}`;
}

export default async function BilletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (user.nom_role !== "LECTEUR") redirect("/admin");

  const { id } = await params;
  const id_billet = Number(id);

  if (!id || Number.isNaN(id_billet) || id_billet <= 0) {
    throw apiError("BAD_REQUEST", 400, "Invalid id");
  }

  const [rows] = await pool.query(
    `
    SELECT
      b.id_billet,
      b.id_epreuve,
      b.id_utilisateur,
      b.nom,
      b.prenom,
      b.date_achat,
      b.num_place,
      b.prix_achat,
      e.nom_epreuve,
      e.date_heure,
      s.nom_sport,
      si.nom_site
    FROM billet b
    JOIN epreuve e ON e.id_epreuve = b.id_epreuve
    JOIN sport s ON s.id_sport = e.id_sport
    JOIN site si ON si.id_site = e.id_site
    WHERE b.id_billet = :id_billet
    LIMIT 1
    `,
    { id_billet }
  );

  const arr = rows as BilletDetail[];

  if (!arr.length) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">
            FACTURE <span>INTROUVABLE</span>
          </h2>
          <p className="section-subtitle">Ce billet n’existe pas.</p>
        </div>
      </div>
    );
  }

  const billet = arr[0];

  if (billet.id_utilisateur !== user.id_utilisateur) {
    return (
      <div className="section" style={{ paddingTop: 140 }}>
        <div className="section-header">
          <h2 className="section-title">
            ACCÈS <span>REFUSÉ</span>
          </h2>
          <p className="section-subtitle">Ce billet ne vous appartient pas.</p>
        </div>
      </div>
    );
  }

  const dateAchatLong = formatDateFr(billet.date_achat);
  const dateAchatShort = formatDateShortFr(billet.date_achat);
  const dateEpreuve = formatDateFr(billet.date_heure);
  const initials = getInitials(billet.prenom, billet.nom);
  const refFacture = buildInvoiceRef(billet.id_billet, billet.date_achat);

  const prixBillet = Number(billet.prix_achat ?? 0);
  const fraisService = Number((prixBillet * 0.05).toFixed(2));
  const contribution = 1.5;
  const total = Number((prixBillet + fraisService + contribution).toFixed(2));
  const tvaIncluse = Number((total * 0.055).toFixed(2));

  return (
    <section className="invoice-page-shell">
      <div className="invoice-wrapper-premium">
        <div className="invoice-header-premium">
          <div className="invoice-logo-area">
            <div className="invoice-logo-icon">🎿</div>
            <div className="invoice-logo-text">
              <h2>MILANO CORTINA 2026</h2>
              <p>Billetterie officielle</p>
            </div>
          </div>

          <div className="invoice-badge-paid">
            <i>🧾</i>
            <span>Facture acquittée</span>
          </div>
        </div>

        <div className="invoice-body-premium">
          <div className="invoice-ref-row">
            <div className="invoice-ref-left">
              <h1>Détail de la facture</h1>
              <div className="invoice-ref-number">
                <span>Réf. billet : {refFacture}</span>
                <span className="invoice-ref-sep">●</span>
                <span>Émis le {dateAchatShort}</span>
              </div>
            </div>

            <div className="invoice-ref-right">
              Statut : <strong>Payée</strong>
            </div>
          </div>

          <div className="invoice-detail-grid">
            <div className="invoice-detail-block">
              <h3>
                <i>🎟️</i>
                <span>Épreuve & place</span>
              </h3>

              <div className="invoice-event-line">
                <div className="invoice-event-name">
                  {billet.nom_epreuve} · {billet.nom_sport}
                </div>

                <div className="invoice-event-meta">
                  <span className="invoice-meta-item">
                    <span>📍</span> {billet.nom_site}
                  </span>
                  <span className="invoice-meta-item">
                    <span>📅</span> {dateEpreuve}
                  </span>
                </div>

                <div className="invoice-pill-row">
                  <span className="invoice-pill invoice-pill-soft">
                    Billet officiel · placement attribué
                  </span>
                  <span className="invoice-pill invoice-pill-gold">
                    place {billet.num_place}
                  </span>
                </div>
              </div>
            </div>

            <div className="invoice-detail-block">
              <h3>
                <i>👤</i>
                <span>Bénéficiaire</span>
              </h3>

              <div className="invoice-beneficiary-detail">
                <div className="invoice-benef-avatar">{initials}</div>
                <div className="invoice-benef-info">
                  <p>
                    {billet.prenom} {billet.nom}
                  </p>
                  <span>Compte client billetterie JO 2026</span>
                </div>
              </div>

              <div className="invoice-nominative-box">
                <span>🎫</span>
                <span>Billet nominatif · pièce d’identité requise</span>
              </div>
            </div>
          </div>

          <table className="invoice-price-table">
            <tbody>
              <tr>
                <td>Billet individuel ({billet.nom_epreuve})</td>
                <td>{formatMoney(prixBillet)}</td>
              </tr>
              <tr>
                <td>Frais de service (5%)</td>
                <td>{formatMoney(fraisService)}</td>
              </tr>
              <tr>
                <td>Contribution solidarité Jeux</td>
                <td>{formatMoney(contribution)}</td>
              </tr>
              <tr className="invoice-total-row">
                <td>
                  <strong>Total TTC</strong>
                </td>
                <td>
                  <strong className="invoice-total-amount">{formatMoney(total)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="invoice-payment-row">
            <div className="invoice-payment-stamp">
              ✓ réglé le {dateAchatShort}
            </div>
            <div className="invoice-vat-note">
              TVA (5,5%) incluse : {formatMoney(tvaIncluse)}
            </div>
          </div>

          <div className="invoice-footer-premium">
            <div className="invoice-qr-sim">
              <div className="invoice-qr-placeholder" />
              <span>Scan contrôle • {billet.nom_site}</span>
            </div>

            <div className="invoice-footer-actions">
              <a className="invoice-btn-outline" href="/compte">
                ← Retour mes billets
              </a>
              <PrintInvoiceButton />
            </div>
          </div>

          <div className="invoice-legal-note">
            Facture électronique valable sans signature. En cas de contrôle,
            présentez ce billet ainsi que votre pièce d’identité.
          </div>

          <div className="invoice-bottom-link">
            <a href={`/epreuves/${billet.id_epreuve}`}>Voir l’épreuve associée</a>
          </div>

          <div className="invoice-tech-note">
            Achat enregistré le {dateAchatLong} • Billet n°{billet.id_billet}
          </div>
        </div>
      </div>
    </section>
  );
}