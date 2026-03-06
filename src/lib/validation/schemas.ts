import { z } from "zod";

// Schemas de validation pour les données d'entrée des routes d'authentification
export const registerSchema = z.object({
  login: z.string().min(3).max(254),
  mot_de_passe: z.string().min(8).max(200),
});

// Schema de validation pour les données d'entrée de la route de connexion
export const loginSchema = z.object({
  login: z.string().min(3).max(254),
  mot_de_passe: z.string().min(1).max(200),
});

//  Schemas de validation pour les données d'entrée des routes de gestion des pays
export const paysCreateSchema = z.object({
  nom_pays: z.string().min(2).max(100),
});

// Schema de validation pour les données d'entrée de la route de mise à jour d'un pays
export const paysUpdateSchema = z.object({
  nom_pays: z.string().min(2).max(100),
});