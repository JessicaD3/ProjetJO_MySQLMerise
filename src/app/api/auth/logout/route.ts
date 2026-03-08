import { handler } from "@/lib/http/handler";
import { jsonOk } from "@/lib/http/response";
import { requireAuth } from "@/lib/auth/session";
import { NextResponse } from "next/server";

// Route POST /api/auth/logout pour déconnecter l'utilisateur en supprimant le cookie de session
export const POST = handler(async () => {
  await requireAuth();

  const cookieName = process.env.COOKIE_NAME || "session";
  const res = NextResponse.json({ data: { ok: true } }, { status: 200 });

  res.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.APP_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
});