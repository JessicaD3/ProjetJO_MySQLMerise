import { apiError } from "@/lib/http/errors";
import * as athletesRepo from "@/repositories/athletes.repo";
import * as paysRepo from "@/repositories/pays.repo";

async function assertPaysExists(id_pays: number) {
  const p = await paysRepo.getPaysById(id_pays);
  if (!p) throw apiError("BAD_REQUEST", 400, "id_pays does not exist");
}

export async function list() {
  return athletesRepo.listAthletes();
}

export async function get(id_athlete: number) {
  const a = await athletesRepo.getAthleteById(id_athlete);
  if (!a) throw apiError("NOT_FOUND", 404, "Athlete not found");
  return a;
}

export async function create(params: { nom: string; prenom: string; sexe: string; id_pays: number }) {
  await assertPaysExists(params.id_pays);
  const id = await athletesRepo.insertAthlete(params);
  return get(id);
}

export async function update(
  id_athlete: number,
  params: { nom: string; prenom: string; sexe: string; id_pays: number }
) {
  await assertPaysExists(params.id_pays);
  const ok = await athletesRepo.updateAthlete({ id_athlete, ...params });
  if (!ok) throw apiError("NOT_FOUND", 404, "Athlete not found");
  return get(id_athlete);
}

export async function remove(id_athlete: number) {
  const ok = await athletesRepo.deleteAthlete(id_athlete);
  if (!ok) throw apiError("NOT_FOUND", 404, "Athlete not found");
  return { ok: true };
}