import { apiError } from "@/lib/http/errors";
import * as repo from "@/repositories/participations.repo";
import * as athletesRepo from "@/repositories/athletes.repo";
import * as epreuvesRepo from "@/repositories/epreuves.repo";

async function assertAthleteExists(id_athlete: number) {
  const a = await athletesRepo.getAthleteById(id_athlete);
  if (!a) throw apiError("BAD_REQUEST", 400, "id_athlete does not exist");
}

async function assertEpreuveExists(id_epreuve: number) {
  const e = await epreuvesRepo.getEpreuveById(id_epreuve);
  if (!e) throw apiError("BAD_REQUEST", 400, "id_epreuve does not exist");
}

export async function list() {
  return repo.listParticipations();
}

export async function create(params: { id_athlete: number; id_epreuve: number; inscription?: string }) {
  await assertAthleteExists(params.id_athlete);
  await assertEpreuveExists(params.id_epreuve);

  const exists = await repo.existsParticipation(params.id_athlete, params.id_epreuve);
  if (exists) throw apiError("CONFLICT", 409, "Participation already exists");

  await repo.insertParticipation({
    id_athlete: params.id_athlete,
    id_epreuve: params.id_epreuve,
    inscription: params.inscription ?? null,
  });

  return { ok: true };
}

export async function remove(id_athlete: number, id_epreuve: number) {
  const ok = await repo.deleteParticipation(id_athlete, id_epreuve);
  if (!ok) throw apiError("NOT_FOUND", 404, "Participation not found");
  return { ok: true };
}