import * as repo from "@/repositories/classement.repo";

export type MedalsRow = {
  rang: number;
  id_pays: number;
  nom_pays: string;
  or: number;
  argent: number;
  bronze: number;
  total: number;
};

export async function medalsTable(): Promise<MedalsRow[]> {
  const rows = await repo.medalsByCountry();
  return rows.map((r, idx) => ({
    rang: idx + 1,
    id_pays: r.id_pays,
    nom_pays: r.nom_pays,
    or: r.or_count,
    argent: r.argent_count,
    bronze: r.bronze_count,
    total: r.total,
  }));
}