import { apiError } from "@/lib/http/errors";
import * as repo from "@/repositories/sites.repo";

export async function list() {
  return repo.listSites();
}

export async function get(id_site: number) {
  const s = await repo.getSiteById(id_site);
  if (!s) throw apiError("NOT_FOUND", 404, "Site not found");
  return s;
}

export async function create(nom_site: string, capacite: number) {
  const id = await repo.insertSite({ nom_site, capacite });
  return get(id);
}

export async function update(id_site: number, nom_site: string, capacite: number) {
  const ok = await repo.updateSite({ id_site, nom_site, capacite });
  if (!ok) throw apiError("NOT_FOUND", 404, "Site not found");
  return get(id_site);
}

export async function remove(id_site: number) {
  const ok = await repo.deleteSite(id_site);
  if (!ok) throw apiError("NOT_FOUND", 404, "Site not found");
  return { ok: true };
}