// src/app/api/auth/login/route.ts

import { handler } from "@/lib/http/handler";
import { validateBody } from "@/lib/validation/validate";
import { loginSchema } from "@/lib/validation/schemas";
import * as authService from "@/services/auth.service";
import { NextResponse } from "next/server";

type LoginBody = {
  login: string;
  mot_de_passe: string;
};

export const POST = handler(async (req) => {
  const body = (await validateBody(req, loginSchema)) as LoginBody;

  const { user, token } = await authService.login(body.login, body.mot_de_passe);

  const cookieName = process.env.COOKIE_NAME || "session";
  const res = NextResponse.json({ data: user }, { status: 200 });

  res.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.APP_ENV === "production",
    path: "/",
  });

  return res;
});