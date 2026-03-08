import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export type SessionUser = {
  id_utilisateur: number;
  login: string;
  nom_role: string;
};

// Function pour récupérer les informations de l'utilisateur connecté à partir du token JWT stocké dans les cookies
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieName = process.env.COOKIE_NAME || "session";
  const store = await cookies();           
  const token = store.get(cookieName)?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

//  Function pour exiger une authentification et récupérer les informations de l'utilisateur connecté
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();    
  if (!user) throw { code: "UNAUTHORIZED" };
  return user;
}