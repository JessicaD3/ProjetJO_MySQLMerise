import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

// Functions pour le hachage et la vérification des mots de passe
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

// Function pour comparer un mot de passe en clair avec son hash stocké
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}