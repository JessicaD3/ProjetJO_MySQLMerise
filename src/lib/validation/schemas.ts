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

// Pays
export const paysCreateSchema = z.object({
  nom_pays: z.string().min(2).max(100),
});

export const paysUpdateSchema = z.object({
  nom_pays: z.string().min(2).max(100),
});

// Sports
export const sportCreateSchema = z.object({
  nom_sport: z.string().min(2).max(100),
});

export const sportUpdateSchema = z.object({
  nom_sport: z.string().min(2).max(100),
});

// Sites
export const siteCreateSchema = z.object({
  nom_site: z.string().min(2).max(100),
  capacite: z.number().int().min(1).max(100000),
});

export const siteUpdateSchema = z.object({
  nom_site: z.string().min(2).max(100),
  capacite: z.number().int().min(1).max(100000),
});

// Athlètes
export const athleteCreateSchema = z.object({
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  sexe: z.enum(["M", "F"]),
  id_pays: z.number().int().positive(),
});

export const athleteUpdateSchema = z.object({
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  sexe: z.enum(["M", "F"]),
  id_pays: z.number().int().positive(),
});

// Epreuves
export const epreuveCreateSchema = z.object({
  nom_epreuve: z.string().min(2).max(150),
  date_heure: z.string().min(5).max(40), 
  id_sport: z.number().int().positive(),
  id_site: z.number().int().positive(),
});

export const epreuveUpdateSchema = z.object({
  nom_epreuve: z.string().min(2).max(150),
  date_heure: z.string().min(5).max(40),
  id_sport: z.number().int().positive(),
  id_site: z.number().int().positive(),
});

// Participations
export const participationCreateSchema = z.object({
  id_athlete: z.number().int().positive(),
  id_epreuve: z.number().int().positive(),
  inscription: z.string().optional(), 
});

export const participationDeleteSchema = z.object({
  id_athlete: z.number().int().positive(),
  id_epreuve: z.number().int().positive(),
});

// Resultats
export const resultatCreateSchema = z.object({
  id_athlete: z.number().int().positive(),
  id_epreuve: z.number().int().positive(),
  temps: z.string().min(1).max(50),
  classement: z.number().int().min(1).max(9999),
});

export const resultatUpdateSchema = z.object({
  id_athlete: z.number().int().positive(),
  id_epreuve: z.number().int().positive(),
  temps: z.string().min(1).max(50),
  classement: z.number().int().min(1).max(9999),
});

// Medailles
export const medalAttribuerSchema = z.object({
  id_epreuve: z.number().int().positive(),
  id_athlete: z.number().int().positive(),
  type_medaille: z.enum(["OR", "ARGENT", "BRONZE"]),
});

 // Billets
 export const billetCreateSchema = z.object({
  id_epreuve: z.number().int().positive(),
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  num_place: z.string().min(1).max(50),
  prix_achat: z.number().min(0).max(100000),
  date_achat: z.string().optional(), 
});