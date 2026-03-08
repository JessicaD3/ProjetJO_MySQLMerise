import { apiError } from "@/lib/http/errors";
import { withTx } from "@/lib/db/tx";
import * as repo from "@/repositories/billets.repo";
import * as epreuveRepo from "@/repositories/epreuves.repo";

function toMysqlDateTime(input?: string): string {
  if (!input) {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  const trimmed = input.trim();
  const mysqlLike = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?$/.test(trimmed);
  if (mysqlLike) return trimmed.length === 16 ? `${trimmed}:00` : trimmed;

  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) throw apiError("BAD_REQUEST", 400, "Invalid date_achat");

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export async function list() {
  return repo.listBillets();
}

export async function get(id_billet: number) {
  const b = await repo.getBilletById(id_billet);
  if (!b) throw apiError("NOT_FOUND", 404, "Billet not found");
  return b;
}

export async function countForEpreuve(id_epreuve: number) {
  // vérifie que l’épreuve existe (sinon 0 ambigu)
  const e = await epreuveRepo.getEpreuveById(id_epreuve);
  if (!e) throw apiError("NOT_FOUND", 404, "Epreuve not found");
  const c = await repo.countBilletsByEpreuve(id_epreuve);
  return { id_epreuve, count: c };
}

export async function create(params: {
  id_epreuve: number;
  id_utilisateur: number;
  nom: string;
  prenom: string;
  num_place: string;
  prix_achat: number;
  date_achat?: string;
}) {
  // Transaction : lock capacité + lock billets
  return withTx(async (conn) => {
    const capacite = await repo.getSiteCapaciteForEpreuve(conn, params.id_epreuve);
    if (capacite === null) throw apiError("BAD_REQUEST", 400, "id_epreuve does not exist");

    const sold = await repo.lockBilletsForEpreuve(conn, params.id_epreuve);
    if (sold >= capacite) {
      throw apiError("CONFLICT", 409, "Capacity reached for this epreuve");
    }

    const date_achat = toMysqlDateTime(params.date_achat);

    const id_billet = await repo.insertBilletTx(conn, {
      id_epreuve: params.id_epreuve,
      id_utilisateur: params.id_utilisateur,
      nom: params.nom,
      prenom: params.prenom,
      date_achat,
      num_place: params.num_place,
      prix_achat: params.prix_achat,
    });

    return { ok: true, id_billet };
  });
}