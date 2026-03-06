import { ZodSchema } from "zod";
import { apiError } from "@/lib/http/errors";

// Functions pour lire les données JSON d'une requête et valider le corps de la requête en utilisant un schema Zod
export async function readJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// Function pour valider le corps de la requête en utilisant un schema Zod, et lancer une ApiError en cas d'erreur de validation
export async function validateBody<T>(req: Request, schema: ZodSchema<T>) {
  const body = await readJson(req);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw apiError("VALIDATION_ERROR", 400, parsed.error.flatten());
  }
  return parsed.data;
}