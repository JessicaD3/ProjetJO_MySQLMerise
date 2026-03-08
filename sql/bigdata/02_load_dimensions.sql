USE jo_2026_dw;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE fact_resultats;
TRUNCATE TABLE fact_billets;
TRUNCATE TABLE dim_epreuve;
TRUNCATE TABLE dim_pays;
TRUNCATE TABLE dim_sport;
TRUNCATE TABLE dim_site;
TRUNCATE TABLE dim_date;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO dim_site (id_site, nom_site, capacite)
SELECT id_site, nom_site, capacite
FROM jo_2026.site;

INSERT INTO dim_sport (id_sport, nom_sport)
SELECT id_sport, nom_sport
FROM jo_2026.sport;

INSERT INTO dim_pays (id_pays, nom_pays)
SELECT id_pays, nom_pays
FROM jo_2026.pays;

INSERT INTO dim_epreuve (id_epreuve, nom_epreuve, id_sport, id_site, date_heure)
SELECT id_epreuve, nom_epreuve, id_sport, id_site, date_heure
FROM jo_2026.epreuve;

INSERT INTO dim_date (id_date, date_complete, jour, mois, trimestre, annee)
SELECT DISTINCT
  CAST(DATE_FORMAT(d.date_val, '%Y%m%d') AS UNSIGNED) AS id_date,
  d.date_val,
  DAY(d.date_val),
  MONTH(d.date_val),
  QUARTER(d.date_val),
  YEAR(d.date_val)
FROM (
  SELECT DATE(date_achat) AS date_val FROM jo_2026.billet
  UNION
  SELECT DATE(date_heure) AS date_val FROM jo_2026.epreuve
) d
WHERE d.date_val IS NOT NULL;