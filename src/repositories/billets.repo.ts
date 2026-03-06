import type { PoolConnection } from "mysql2/promise";
import pool from "@/lib/db/pool";

export type DbBillet = {
  id_billet: number;
  id_epreuve: number;
  id_utilisateur: number;
  nom: string;
  prenom: string;
  date_achat: string;
  num_place: string;
  prix_achat: number;
};

export async function listBillets(): Promise<DbBillet[]> {
  const [rows] = await pool.query(
    `SELECT id_billet, id_epreuve, id_utilisateur, nom, prenom, date_achat, num_place, prix_achat
     FROM billet
     ORDER BY date_achat DESC`
  );
  return rows as DbBillet[];
}

export async function getBilletById(id_billet: number): Promise<DbBillet | null> {
  const [rows] = await pool.query(
    `SELECT id_billet, id_epreuve, id_utilisateur, nom, prenom, date_achat, num_place, prix_achat
     FROM billet
     WHERE id_billet = :id_billet
     LIMIT 1`,
    { id_billet }
  );
  const arr = rows as any[];
  return arr.length ? (arr[0] as DbBillet) : null;
}

export async function countBilletsByEpreuve(id_epreuve: number): Promise<number> {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS c FROM billet WHERE id_epreuve = :id_epreuve`,
    { id_epreuve }
  );
  return Number((rows as any[])[0]?.c ?? 0);
}

/** 🔒 Version transactionnelle: verrouille les billets de l’épreuve (anti double-vente) */
export async function lockBilletsForEpreuve(conn: PoolConnection, id_epreuve: number): Promise<number> {
  const [rows] = await conn.query(
    `SELECT id_billet FROM billet WHERE id_epreuve = :id_epreuve FOR UPDATE`,
    { id_epreuve }
  );
  return (rows as any[]).length; // nombre de billets existants, verrouillés
}

export async function getSiteCapaciteForEpreuve(conn: PoolConnection, id_epreuve: number): Promise<number | null> {
  const [rows] = await conn.query(
    `
    SELECT s.capacite AS capacite
    FROM epreuve e
    JOIN site s ON s.id_site = e.id_site
    WHERE e.id_epreuve = :id_epreuve
    LIMIT 1
    FOR UPDATE
    `,
    { id_epreuve }
  );
  const arr = rows as any[];
  return arr.length ? Number(arr[0].capacite) : null;
}

export async function insertBilletTx(conn: PoolConnection, params: {
  id_epreuve: number;
  id_utilisateur: number;
  nom: string;
  prenom: string;
  date_achat: string;   // "YYYY-MM-DD HH:MM:SS"
  num_place: string;
  prix_achat: number;
}): Promise<number> {
  const [res] = await conn.query(
    `
    INSERT INTO billet (id_epreuve, id_utilisateur, nom, prenom, date_achat, num_place, prix_achat)
    VALUES (:id_epreuve, :id_utilisateur, :nom, :prenom, :date_achat, :num_place, :prix_achat)
    `,
    params
  );
  return (res as any).insertId as number;
}