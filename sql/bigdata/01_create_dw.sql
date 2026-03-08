USE jo_2026_dw;

DROP TABLE IF EXISTS fact_resultats;
DROP TABLE IF EXISTS fact_billets;
DROP TABLE IF EXISTS dim_epreuve;
DROP TABLE IF EXISTS dim_pays;
DROP TABLE IF EXISTS dim_sport;
DROP TABLE IF EXISTS dim_site;
DROP TABLE IF EXISTS dim_date;

CREATE TABLE dim_date (
  id_date INT PRIMARY KEY,
  date_complete DATE NOT NULL UNIQUE,
  jour INT NOT NULL,
  mois INT NOT NULL,
  trimestre INT NOT NULL,
  annee INT NOT NULL
);

CREATE TABLE dim_site (
  id_site INT PRIMARY KEY,
  nom_site VARCHAR(100) NOT NULL,
  capacite INT NOT NULL
);

CREATE TABLE dim_sport (
  id_sport INT PRIMARY KEY,
  nom_sport VARCHAR(100) NOT NULL
);

CREATE TABLE dim_pays (
  id_pays INT PRIMARY KEY,
  nom_pays VARCHAR(100) NOT NULL
);

CREATE TABLE dim_epreuve (
  id_epreuve INT PRIMARY KEY,
  nom_epreuve VARCHAR(150) NOT NULL,
  id_sport INT NOT NULL,
  id_site INT NOT NULL,
  date_heure DATETIME NOT NULL
);

CREATE TABLE fact_billets (
  id_fact_billet INT AUTO_INCREMENT PRIMARY KEY,
  id_date INT NOT NULL,
  id_epreuve INT NOT NULL,
  id_site INT NOT NULL,
  id_sport INT NOT NULL,
  nb_billets INT NOT NULL,
  chiffre_affaires DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (id_date) REFERENCES dim_date(id_date),
  FOREIGN KEY (id_epreuve) REFERENCES dim_epreuve(id_epreuve),
  FOREIGN KEY (id_site) REFERENCES dim_site(id_site),
  FOREIGN KEY (id_sport) REFERENCES dim_sport(id_sport)
);

CREATE TABLE fact_resultats (
  id_fact_resultat INT AUTO_INCREMENT PRIMARY KEY,
  id_date INT NOT NULL,
  id_epreuve INT NOT NULL,
  id_sport INT NOT NULL,
  id_pays INT NOT NULL,
  nb_participations INT NOT NULL,
  nb_medailles_or INT NOT NULL,
  nb_medailles_argent INT NOT NULL,
  nb_medailles_bronze INT NOT NULL,
  FOREIGN KEY (id_date) REFERENCES dim_date(id_date),
  FOREIGN KEY (id_epreuve) REFERENCES dim_epreuve(id_epreuve),
  FOREIGN KEY (id_sport) REFERENCES dim_sport(id_sport),
  FOREIGN KEY (id_pays) REFERENCES dim_pays(id_pays)
);