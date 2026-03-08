import { apiError } from "@/lib/http/errors";
import * as repo from "@/repositories/sports.repo";

export async function list() {
  return repo.listSports();
}

export async function get(id_sport: number) {
  const s = await repo.getSportById(id_sport);
  if (!s) throw apiError("NOT_FOUND", 404, "Sport not found");
  return s;
}

export async function create(nom_sport: string) {
  const id = await repo.insertSport(nom_sport);
  return get(id);
}

export async function update(id_sport: number, nom_sport: string) {
  const ok = await repo.updateSport(id_sport, nom_sport);
  if (!ok) throw apiError("NOT_FOUND", 404, "Sport not found");
  return get(id_sport);
}

export async function remove(id_sport: number) {
  const ok = await repo.deleteSport(id_sport);
  if (!ok) throw apiError("NOT_FOUND", 404, "Sport not found");
  return { ok: true };
}