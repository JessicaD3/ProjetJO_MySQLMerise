import { apiError } from "@/lib/http/errors";
import * as partRepo from "@/repositories/participations.repo";
import * as repo from "@/repositories/resultats.repo";

export async function list() {
  return repo.listResultats();
}

async function assertParticipation(id_athlete: number, id_epreuve: number) {
  const ok = await partRepo.existsParticipation(id_athlete, id_epreuve);
  if (!ok) throw apiError("BAD_REQUEST", 400, "Result requires existing participation");
}

export async function create(params: { id_athlete: number; id_epreuve: number; temps: string; classement: number }) {
  await assertParticipation(params.id_athlete, params.id_epreuve);

  const existing = await repo.getResultat(params.id_athlete, params.id_epreuve);
  if (existing) throw apiError("CONFLICT", 409, "Result already exists for this athlete/epreuve");

  await repo.insertResultat(params);
  return { ok: true };
}

export async function update(params: { id_athlete: number; id_epreuve: number; temps: string; classement: number }) {
  await assertParticipation(params.id_athlete, params.id_epreuve);

  const ok = await repo.updateResultat(params);
  if (!ok) throw apiError("NOT_FOUND", 404, "Result not found");
  return { ok: true };
}