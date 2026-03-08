import { handler } from "@/lib/http/handler";
import { jsonCreated } from "@/lib/http/response";
import { validateBody } from "@/lib/validation/validate";
import { registerSchema } from "@/lib/validation/schemas";
import * as authService from "@/services/auth.service";
import { signUser } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";

// Route POST /api/auth/register pour inscrire un nouvel utilisateur
export const POST = handler(async (req) => {
  const body = await validateBody(req, registerSchema);

  const created = await authService.register(body.login, body.mot_de_passe);

  const token = signUser({
    id_utilisateur: created.id_utilisateur,
    login: created.login,
    nom_role: created.nom_role,
  });
  const cookieName = process.env.COOKIE_NAME || "session";
  const res = NextResponse.json({ data: created }, { status: 201 });

  res.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.APP_ENV === "production",
    path: "/",
  });

  return res;
});
