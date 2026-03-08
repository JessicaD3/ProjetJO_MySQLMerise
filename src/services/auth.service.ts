import { apiError } from "@/lib/http/errors";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signUser } from "@/lib/auth/jwt";
import { findUserByLogin, insertUser } from "@/repositories/auth.repo";
import { findRoleIdByName } from "@/repositories/role.repo";

const DEFAULT_ROLE = "LECTEUR"; // Rôle par défaut attribué aux nouveaux utilisateurs. Doit correspondre à un nom_role dans la table role de la base de données

// Service d'authentification qui gère l'inscription et la connexion des utilisateurs
export async function register(login: string, mot_de_passe: string) {
  const existing = await findUserByLogin(login);
  if (existing) {
    throw apiError("CONFLICT", 409, "Login already exists");
  }
// Récupérer l'ID du rôle par défaut à partir de la base de données
  const id_role = await findRoleIdByName(DEFAULT_ROLE);
  if (!id_role) {
    throw apiError(
      "CONFIG_ERROR",
      500,
      `Role "${DEFAULT_ROLE}" not found. Please seed the role table.`
    );
  }

  const hashed = await hashPassword(mot_de_passe);
  const id_utilisateur = await insertUser({ login, mot_de_passe: hashed, id_role });

  return {
    id_utilisateur,
    login,
    nom_role: DEFAULT_ROLE,
  };
}

// Function pour authentifier un utilisateur en vérifiant ses identifiants et en générant un token JWT
export async function login(login: string, mot_de_passe: string) {
  const user = await findUserByLogin(login);
  if (!user) {
    throw apiError("UNAUTHORIZED", 401, "Invalid credentials");
  }

  const ok = await verifyPassword(mot_de_passe, user.mot_de_passe);
  if (!ok) {
    throw apiError("UNAUTHORIZED", 401, "Invalid credentials");
  }
  
// Payload du token JWT contenant les informations de l'utilisateur
  const payload = {
    id_utilisateur: user.id_utilisateur,
    login: user.login,
    nom_role: user.nom_role,
  };

  const token = signUser(payload);

  return { user: payload, token };
}