import { NextResponse } from "next/server";
//Functions pour créer des réponses JSON standardisées pour les succès et les erreurs
export function jsonOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data }, { status: 200, ...init });
}

// Function pour créer une réponse JSON d'erreur avec un message et des détails optionnels
export function jsonError(status: number, error: string, details?: unknown) {
  return NextResponse.json({ error, details: details ?? null }, { status });
}