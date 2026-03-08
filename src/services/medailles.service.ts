import { apiError } from "@/lib/http/errors";
import * as medRepo from "@/repositories/medailles.repo";
import * as resRepo from "@/repositories/resultats.repo";
import * as partRepo from "@/repositories/participations.repo";
import * as epreuveRepo from "@/repositories/epreuves.repo";
import * as athleteRepo from "@/repositories/athletes.repo";

async function assertEpreuveExists(id_epreuve: number) {
  const e = await epreuveRepo.getEpreuveById(id_epreuve);
  if (!e) throw apiError("BAD_REQUEST", 400, "id_epreuve does not exist");
}

async function assertAthleteExists(id_athlete: number) {
  const a = await athleteRepo.getAthleteById(id_athlete);
  if (!a) throw apiError("BAD_REQUEST", 400, "id_athlete does not exist");
}

export async function list() {
  return medRepo.listMedailles();
}

export async function attribuer(params: {
  id_epreuve: number;
  id_athlete: number;
  type_medaille: "OR" | "ARGENT" | "BRONZE";
}) {
  await assertEpreuveExists(params.id_epreuve);
  await assertAthleteExists(params.id_athlete);

  // 1) participation obligatoire
  const hasParticipation = await partRepo.existsParticipation(params.id_athlete, params.id_epreuve);
  if (!hasParticipation) {
    throw apiError("BAD_REQUEST", 400, "Medal requires existing participation");
  }

  // 2) résultat obligatoire (à partir des résultats)
  const resultat = await resRepo.getResultat(params.id_athlete, params.id_epreuve);
  if (!resultat) {
    throw apiError("BAD_REQUEST", 400, "Medal requires existing result");
  }

  // 3) unicité (epreuve, type)
  const exists = await medRepo.existsMedailleForEpreuveType(params.id_epreuve, params.type_medaille);
  if (exists) {
    throw apiError("CONFLICT", 409, "Medal type already assigned for this epreuve");
  }

  const id_medaille = await medRepo.insertMedaille(params);
  return { ok: true, id_medaille };
}