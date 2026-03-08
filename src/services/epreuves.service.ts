import { apiError } from "@/lib/http/errors";
import * as repo from "@/repositories/epreuves.repo";
import * as sportsRepo from "@/repositories/sports.repo";
import * as sitesRepo from "@/repositories/sites.repo";

function toMysqlDateTime(input: string): string {
  // On accepte :
  // - ISO: "2026-02-15T14:00:00.000Z" ou "2026-02-15T14:00:00"
  // - format déjà MySQL: "2026-02-15 14:00:00"
  const trimmed = input.trim();

  // Si format MySQL "YYYY-MM-DD HH:MM:SS"
  const mysqlLike = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?$/.test(trimmed);
  if (mysqlLike) {
    return trimmed.length === 16 ? `${trimmed}:00` : trimmed; // ajoute secondes si manquantes
  }

  // Sinon, on tente un parse Date
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) throw apiError("BAD_REQUEST", 400, "Invalid date_heure");

  // On formate en local (MySQL DATETIME sans timezone)
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

async function assertSportExists(id_sport: number) {
  const s = await sportsRepo.getSportById(id_sport);
  if (!s) throw apiError("BAD_REQUEST", 400, "id_sport does not exist");
}

async function assertSiteExists(id_site: number) {
  const s = await sitesRepo.getSiteById(id_site);
  if (!s) throw apiError("BAD_REQUEST", 400, "id_site does not exist");
}

export async function list() {
  return repo.listEpreuves();
}

export async function get(id_epreuve: number) {
  const e = await repo.getEpreuveById(id_epreuve);
  if (!e) throw apiError("NOT_FOUND", 404, "Epreuve not found");
  return e;
}

export async function create(params: {
  nom_epreuve: string;
  date_heure: string;
  id_sport: number;
  id_site: number;
}) {
  await assertSportExists(params.id_sport);
  await assertSiteExists(params.id_site);

  const date_heure = toMysqlDateTime(params.date_heure);

  const id = await repo.insertEpreuve({
    nom_epreuve: params.nom_epreuve,
    date_heure,
    id_sport: params.id_sport,
    id_site: params.id_site,
  });

  return get(id);
}

export async function update(
  id_epreuve: number,
  params: { nom_epreuve: string; date_heure: string; id_sport: number; id_site: number }
) {
  await assertSportExists(params.id_sport);
  await assertSiteExists(params.id_site);

  const date_heure = toMysqlDateTime(params.date_heure);

  const ok = await repo.updateEpreuve({
    id_epreuve,
    nom_epreuve: params.nom_epreuve,
    date_heure,
    id_sport: params.id_sport,
    id_site: params.id_site,
  });

  if (!ok) throw apiError("NOT_FOUND", 404, "Epreuve not found");
  return get(id_epreuve);
}

export async function remove(id_epreuve: number) {
  const ok = await repo.deleteEpreuve(id_epreuve);
  if (!ok) throw apiError("NOT_FOUND", 404, "Epreuve not found");
  return { ok: true };
}