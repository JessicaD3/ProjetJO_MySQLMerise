import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import * as service from "@/services/classement.service";

// Public lecture : on autorise sans auth (LECTEUR/public)
// Si tu veux protéger, on met requireAuth + role.
export const GET = handler(async () => {
  const data = await service.medalsTable();
  return jsonOk(data);
});