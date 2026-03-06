import { apiError } from "@/lib/http/errors";
import * as repo from "@/repositories/pays.repo";

// Service de gestion des pays, qui fait le lien entre les routes et les fonctions de la couche repository
export async function list() {
  return repo.listPays();
}

//  Récupération d'un pays par son ID, renvoie une erreur 404 si le pays n'existe pas
export async function get(id_pays: number) {
  const p = await repo.getPaysById(id_pays);
  if (!p) throw apiError("NOT_FOUND", 404, "Pays not found");
  return p;
}

// Création d'un nouveau pays, renvoie une erreur 409 en cas de doublon (contrainte unique côté DB)
export async function create(nom_pays: string) {
  const id = await repo.insertPays(nom_pays);
  return get(id);
}

// Mise à jour du nom d'un pays, renvoie une erreur 404 si le pays n'existe pas ou si la mise à jour a échoué

export async function update(id_pays: number, nom_pays: string) {
  const ok = await repo.updatePays(id_pays, nom_pays);
  if (!ok) throw apiError("NOT_FOUND", 404, "Pays not found");
  return get(id_pays);
}

//  Suppression d'un pays par son ID, renvoie une erreur 404 si le pays n'existe pas ou si la suppression a échoué
export async function remove(id_pays: number) {
  const ok = await repo.deletePays(id_pays);
  if (!ok) throw apiError("NOT_FOUND", 404, "Pays not found");
  return { ok: true };
}