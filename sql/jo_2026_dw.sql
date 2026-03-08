-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: jo_2026_dw
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dim_date`
--

DROP TABLE IF EXISTS `dim_date`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dim_date` (
  `id_date` int NOT NULL,
  `date_complete` date NOT NULL,
  `jour` int NOT NULL,
  `mois` int NOT NULL,
  `trimestre` int NOT NULL,
  `annee` int NOT NULL,
  PRIMARY KEY (`id_date`),
  UNIQUE KEY `date_complete` (`date_complete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dim_date`
--

LOCK TABLES `dim_date` WRITE;
/*!40000 ALTER TABLE `dim_date` DISABLE KEYS */;
INSERT INTO `dim_date` VALUES (20260115,'2026-01-15',15,1,1,2026),(20260215,'2026-02-15',15,2,1,2026),(20260218,'2026-02-18',18,2,1,2026),(20260220,'2026-02-20',20,2,1,2026),(20260307,'2026-03-07',7,3,1,2026),(20260329,'2026-03-29',29,3,1,2026);
/*!40000 ALTER TABLE `dim_date` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dim_epreuve`
--

DROP TABLE IF EXISTS `dim_epreuve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dim_epreuve` (
  `id_epreuve` int NOT NULL,
  `nom_epreuve` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `id_sport` int NOT NULL,
  `id_site` int NOT NULL,
  `date_heure` datetime NOT NULL,
  PRIMARY KEY (`id_epreuve`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dim_epreuve`
--

LOCK TABLES `dim_epreuve` WRITE;
/*!40000 ALTER TABLE `dim_epreuve` DISABLE KEYS */;
INSERT INTO `dim_epreuve` VALUES (1,'Descente hommes',1,1,'2026-02-15 14:00:00'),(2,'Programme court femmes',2,2,'2026-02-18 20:00:00'),(3,'Finale Hockey',3,3,'2026-02-20 15:30:00'),(4,'Descente Femmes',1,4,'2026-03-29 15:58:00');
/*!40000 ALTER TABLE `dim_epreuve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dim_pays`
--

DROP TABLE IF EXISTS `dim_pays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dim_pays` (
  `id_pays` int NOT NULL,
  `nom_pays` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_pays`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dim_pays`
--

LOCK TABLES `dim_pays` WRITE;
/*!40000 ALTER TABLE `dim_pays` DISABLE KEYS */;
INSERT INTO `dim_pays` VALUES (1,'France'),(2,'Italie'),(3,'Suisse'),(4,'Canada'),(5,'États-Unis'),(6,'Japon');
/*!40000 ALTER TABLE `dim_pays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dim_site`
--

DROP TABLE IF EXISTS `dim_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dim_site` (
  `id_site` int NOT NULL,
  `nom_site` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `capacite` int NOT NULL,
  PRIMARY KEY (`id_site`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dim_site`
--

LOCK TABLES `dim_site` WRITE;
/*!40000 ALTER TABLE `dim_site` DISABLE KEYS */;
INSERT INTO `dim_site` VALUES (1,'Piste Olympia',2),(2,'Palavela',3),(3,'Mediolanum Forum',2),(4,'Piste Winniza',1000);
/*!40000 ALTER TABLE `dim_site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dim_sport`
--

DROP TABLE IF EXISTS `dim_sport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dim_sport` (
  `id_sport` int NOT NULL,
  `nom_sport` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_sport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dim_sport`
--

LOCK TABLES `dim_sport` WRITE;
/*!40000 ALTER TABLE `dim_sport` DISABLE KEYS */;
INSERT INTO `dim_sport` VALUES (1,'Ski Alpin'),(2,'Patinage Artistique'),(3,'Hockey sur Glace'),(4,'Ski Course'),(5,'Patinage chronométré');
/*!40000 ALTER TABLE `dim_sport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fact_billets`
--

DROP TABLE IF EXISTS `fact_billets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fact_billets` (
  `id_fact_billet` int NOT NULL AUTO_INCREMENT,
  `id_date` int NOT NULL,
  `id_epreuve` int NOT NULL,
  `id_site` int NOT NULL,
  `id_sport` int NOT NULL,
  `nb_billets` int NOT NULL,
  `chiffre_affaires` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id_fact_billet`),
  KEY `id_date` (`id_date`),
  KEY `id_epreuve` (`id_epreuve`),
  KEY `id_site` (`id_site`),
  KEY `id_sport` (`id_sport`),
  CONSTRAINT `fact_billets_ibfk_1` FOREIGN KEY (`id_date`) REFERENCES `dim_date` (`id_date`),
  CONSTRAINT `fact_billets_ibfk_2` FOREIGN KEY (`id_epreuve`) REFERENCES `dim_epreuve` (`id_epreuve`),
  CONSTRAINT `fact_billets_ibfk_3` FOREIGN KEY (`id_site`) REFERENCES `dim_site` (`id_site`),
  CONSTRAINT `fact_billets_ibfk_4` FOREIGN KEY (`id_sport`) REFERENCES `dim_sport` (`id_sport`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fact_billets`
--

LOCK TABLES `fact_billets` WRITE;
/*!40000 ALTER TABLE `fact_billets` DISABLE KEYS */;
INSERT INTO `fact_billets` VALUES (1,20260115,1,1,1,2,170.00),(2,20260307,3,3,3,1,85.00),(3,20260307,2,2,2,2,170.00);
/*!40000 ALTER TABLE `fact_billets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fact_resultats`
--

DROP TABLE IF EXISTS `fact_resultats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fact_resultats` (
  `id_fact_resultat` int NOT NULL AUTO_INCREMENT,
  `id_date` int NOT NULL,
  `id_epreuve` int NOT NULL,
  `id_sport` int NOT NULL,
  `id_pays` int NOT NULL,
  `nb_participations` int NOT NULL,
  `nb_medailles_or` int NOT NULL,
  `nb_medailles_argent` int NOT NULL,
  `nb_medailles_bronze` int NOT NULL,
  PRIMARY KEY (`id_fact_resultat`),
  KEY `id_date` (`id_date`),
  KEY `id_epreuve` (`id_epreuve`),
  KEY `id_sport` (`id_sport`),
  KEY `id_pays` (`id_pays`),
  CONSTRAINT `fact_resultats_ibfk_1` FOREIGN KEY (`id_date`) REFERENCES `dim_date` (`id_date`),
  CONSTRAINT `fact_resultats_ibfk_2` FOREIGN KEY (`id_epreuve`) REFERENCES `dim_epreuve` (`id_epreuve`),
  CONSTRAINT `fact_resultats_ibfk_3` FOREIGN KEY (`id_sport`) REFERENCES `dim_sport` (`id_sport`),
  CONSTRAINT `fact_resultats_ibfk_4` FOREIGN KEY (`id_pays`) REFERENCES `dim_pays` (`id_pays`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fact_resultats`
--

LOCK TABLES `fact_resultats` WRITE;
/*!40000 ALTER TABLE `fact_resultats` DISABLE KEYS */;
INSERT INTO `fact_resultats` VALUES (1,20260215,1,1,1,1,1,0,0),(2,20260215,1,1,2,1,0,0,1),(3,20260215,1,1,3,1,0,1,0),(4,20260218,2,2,2,1,0,1,0),(5,20260218,2,2,5,1,1,0,0),(6,20260218,2,2,6,1,0,0,1),(7,20260220,3,3,2,1,0,0,1),(8,20260220,3,3,4,1,1,0,0);
/*!40000 ALTER TABLE `fact_resultats` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-08 20:21:15
