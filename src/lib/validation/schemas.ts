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