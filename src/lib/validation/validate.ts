import { ZodSchema } from "zod";
import { apiError } from "@/lib/http/errors";

// Fonction utilitaire pour lire et parser le corps d'une requête en JSON, renvoie null si le parsing échoue (ex: corps vide ou non-JSON)
export async function readJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// Fonction de validation d'un corps de requête JSON à l'aide d'un schéma Zod, renvoie une erreur 400 en cas de validation échouée
export async function validateBody<T>(req: Request, schema: ZodSchema<T>) {
  if (!schema) {
    throw apiError("CONFIG_ERROR", 500, "Validation schema is undefined (check imports/exports)");
  }

  const body = await readJson(req);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw apiError("VALIDATION_ERROR", 400, parsed.error.flatten());
  }
  return parsed.data;
}