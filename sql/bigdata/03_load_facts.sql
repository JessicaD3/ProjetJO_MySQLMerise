USE jo_2026_dw;

INSERT INTO fact_billets (id_date, id_epreuve, id_site, id_sport, nb_billets, chiffre_affaires)
SELECT
  CAST(DATE_FORMAT(DATE(b.date_achat), '%Y%m%d') AS UNSIGNED) AS id_date,
  e.id_epreuve,
  e.id_site,
  e.id_sport,
  COUNT(*) AS nb_billets,
  SUM(b.prix_achat) AS chiffre_affaires
FROM jo_2026.billet b
JOIN jo_2026.epreuve e ON e.id_epreuve = b.id_epreuve
GROUP BY
  CAST(DATE_FORMAT(DATE(b.date_achat), '%Y%m%d') AS UNSIGNED),
  e.id_epreuve,
  e.id_site,
  e.id_sport;

INSERT INTO fact_resultats (
  id_date, id_epreuve, id_sport, id_pays,
  nb_participations, nb_medailles_or, nb_medailles_argent, nb_medailles_bronze
)
SELECT
  CAST(DATE_FORMAT(DATE(e.date_heure), '%Y%m%d') AS UNSIGNED) AS id_date,
  e.id_epreuve,
  e.id_sport,
  a.id_pays,
  COUNT(DISTINCT CONCAT(p.id_athlete, '-', p.id_epreuve)) AS nb_participations,
  SUM(CASE WHEN m.type_medaille = 'Or' THEN 1 ELSE 0 END) AS nb_medailles_or,
  SUM(CASE WHEN m.type_medaille = 'Argent' THEN 1 ELSE 0 END) AS nb_medailles_argent,
  SUM(CASE WHEN m.type_medaille = 'Bronze' THEN 1 ELSE 0 END) AS nb_medailles_bronze
FROM jo_2026.participation p
JOIN jo_2026.athlete a ON a.id_athlete = p.id_athlete
JOIN jo_2026.epreuve e ON e.id_epreuve = p.id_epreuve
LEFT JOIN jo_2026.medaille m
  ON m.id_athlete = p.id_athlete
 AND m.id_epreuve = p.id_epreuve
GROUP BY
  CAST(DATE_FORMAT(DATE(e.date_heure), '%Y%m%d') AS UNSIGNED),
  e.id_epreuve,
  e.id_sport,
  a.id_pays;