import * as jwt from "jsonwebtoken";

export type JwtUser = {
  id_utilisateur: number;
  login: string;
  nom_role: string;
};

// Function pour récupérer le secret JWT à partir des variables d'environnement
function secret(): jwt.Secret {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("Missing env var: JWT_SECRET");
  return s;
}

// Function pour créer un token JWT à partir des informations de l'utilisateur
export function signUser(user: JwtUser) {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign(user, secret(), {
    expiresIn,
  });
}

// Function pour vérifier un token JWT et extraire les informations de l'utilisateur
export function verifyToken(token: string): JwtUser {
  return jwt.verify(token, secret()) as JwtUser;
}