USE jo_2026_dw;

SELECT
  ds.nom_sport,
  SUM(fb.chiffre_affaires) AS chiffre_affaires
FROM fact_billets fb
JOIN dim_sport ds ON ds.id_sport = fb.id_sport
GROUP BY ds.nom_sport
ORDER BY chiffre_affaires DESC;

SELECT
  de.nom_epreuve,
  ds.nom_site,
  ds.capacite,
  SUM(fb.nb_billets) AS billets_vendus,
  ROUND(SUM(fb.nb_billets) * 100.0 / ds.capacite, 2) AS taux_remplissage
FROM fact_billets fb
JOIN dim_epreuve de ON de.id_epreuve = fb.id_epreuve
JOIN dim_site ds ON ds.id_site = fb.id_site
GROUP BY de.nom_epreuve, ds.nom_site, ds.capacite
ORDER BY taux_remplissage DESC;

SELECT
  dp.nom_pays,
  SUM(fr.nb_medailles_or) AS or_total,
  SUM(fr.nb_medailles_argent) AS argent_total,
  SUM(fr.nb_medailles_bronze) AS bronze_total,
  SUM(fr.nb_medailles_or + fr.nb_medailles_argent + fr.nb_medailles_bronze) AS total
FROM fact_resultats fr
JOIN dim_pays dp ON dp.id_pays = fr.id_pays
GROUP BY dp.nom_pays
ORDER BY total DESC, or_total DESC;

SELECT
  dd.date_complete,
  SUM(fb.nb_billets) AS nb_billets,
  SUM(fb.chiffre_affaires) AS ca
FROM fact_billets fb
JOIN dim_date dd ON dd.id_date = fb.id_date
GROUP BY dd.date_complete
ORDER BY dd.date_complete;