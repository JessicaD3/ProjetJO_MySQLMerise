import type { SessionUser } from "./session";

export const ROLES = ["ADMIN", "ORGANISATEUR", "AGENT_BILLETTERIE", "LECTEUR"] as const;
export type Role = (typeof ROLES)[number];

// Function pour vérifier si l'utilisateur a un rôle autorisé pour accéder à une ressource ou effectuer une action
export function requireRole(user: SessionUser, allowed: Role[]) {
  const role = user.nom_role as Role;
  if (!allowed.includes(role)) throw new Error("FORBIDDEN");
}