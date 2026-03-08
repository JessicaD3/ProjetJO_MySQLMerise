-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: jo_2026
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
-- Table structure for table `athlete`
--

DROP TABLE IF EXISTS `athlete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `athlete` (
  `id_athlete` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `sexe` char(1) DEFAULT NULL,
  `id_pays` int NOT NULL,
  PRIMARY KEY (`id_athlete`),
  KEY `fk_athlete_pays` (`id_pays`),
  CONSTRAINT `fk_athlete_pays` FOREIGN KEY (`id_pays`) REFERENCES `pays` (`id_pays`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `athlete`
--

LOCK TABLES `athlete` WRITE;
/*!40000 ALTER TABLE `athlete` DISABLE KEYS */;
INSERT INTO `athlete` VALUES (1,'Pinturault','Alexis','M',1),(2,'Goggia','Sofia','F',2),(3,'Odermatt','Marco','M',3),(5,'Smith','Mikaela','F',5),(6,'Suzuki','Hana','F',6),(7,'McDavid','Connor','M',4),(8,'Rossi','Luca','M',2);
/*!40000 ALTER TABLE `athlete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billet`
--

DROP TABLE IF EXISTS `billet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billet` (
  `id_billet` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `date_achat` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `num_place` varchar(20) DEFAULT NULL COMMENT 'Nullable pour placement libre',
  `prix_achat` decimal(10,2) NOT NULL,
  `id_utilisateur` int NOT NULL,
  `id_epreuve` int NOT NULL,
  PRIMARY KEY (`id_billet`),
  UNIQUE KEY `id_epreuve` (`id_epreuve`,`num_place`),
  KEY `fk_billet_utilisateur` (`id_utilisateur`),
  CONSTRAINT `fk_billet_epreuve` FOREIGN KEY (`id_epreuve`) REFERENCES `epreuve` (`id_epreuve`),
  CONSTRAINT `fk_billet_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billet`
--

LOCK TABLES `billet` WRITE;
/*!40000 ALTER TABLE `billet` DISABLE KEYS */;
INSERT INTO `billet` VALUES (1,'Dupont','Alice','2026-01-15 09:00:00','A-01',85.00,3,1),(2,'Martin','Leo','2026-01-15 09:05:00','A-02',85.00,3,1),(3,'Alice','Dupont','2026-03-07 17:05:33','S3-E3-1',85.00,6,3),(4,'Martin','Matin','2026-03-07 18:51:20','S2-E2-1',85.00,6,2),(5,'Martin','Matin','2026-03-07 18:51:20','S2-E2-2',85.00,6,2);
/*!40000 ALTER TABLE `billet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `epreuve`
--

DROP TABLE IF EXISTS `epreuve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `epreuve` (
  `id_epreuve` int NOT NULL AUTO_INCREMENT,
  `nom_epreuve` varchar(150) NOT NULL,
  `date_heure` datetime NOT NULL,
  `id_sport` int NOT NULL,
  `id_site` int NOT NULL,
  PRIMARY KEY (`id_epreuve`),
  KEY `fk_epreuve_sport` (`id_sport`),
  KEY `fk_epreuve_site` (`id_site`),
  CONSTRAINT `fk_epreuve_site` FOREIGN KEY (`id_site`) REFERENCES `site` (`id_site`),
  CONSTRAINT `fk_epreuve_sport` FOREIGN KEY (`id_sport`) REFERENCES `sport` (`id_sport`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `epreuve`
--

LOCK TABLES `epreuve` WRITE;
/*!40000 ALTER TABLE `epreuve` DISABLE KEYS */;
INSERT INTO `epreuve` VALUES (1,'Descente hommes','2026-02-15 14:00:00',1,1),(2,'Programme court femmes','2026-02-18 20:00:00',2,2),(3,'Finale Hockey','2026-02-20 15:30:00',3,3),(4,'Descente Femmes','2026-03-29 15:58:00',1,4);
/*!40000 ALTER TABLE `epreuve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medaille`
--

DROP TABLE IF EXISTS `medaille`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medaille` (
  `id_medaille` int NOT NULL AUTO_INCREMENT,
  `type_medaille` varchar(20) NOT NULL COMMENT 'Or, Argent, Bronze',
  `id_athlete` int NOT NULL,
  `id_epreuve` int NOT NULL,
  PRIMARY KEY (`id_medaille`),
  UNIQUE KEY `id_athlete` (`id_athlete`,`id_epreuve`),
  CONSTRAINT `fk_med_resultat` FOREIGN KEY (`id_athlete`, `id_epreuve`) REFERENCES `resultat` (`id_athlete`, `id_epreuve`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medaille`
--

LOCK TABLES `medaille` WRITE;
/*!40000 ALTER TABLE `medaille` DISABLE KEYS */;
INSERT INTO `medaille` VALUES (1,'OR',1,1),(2,'ARGENT',3,1),(3,'BRONZE',8,1),(4,'ARGENT',2,2),(5,'OR',5,2),(6,'BRONZE',6,2),(7,'OR',7,3),(9,'BRONZE',8,3);
/*!40000 ALTER TABLE `medaille` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participation`
--

DROP TABLE IF EXISTS `participation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participation` (
  `id_athlete` int NOT NULL,
  `id_epreuve` int NOT NULL,
  `inscription` varchar(100) DEFAULT 'Inscrit' COMMENT 'Etat de l''inscription (ex: Inscrit, Forfait, DQ)',
  PRIMARY KEY (`id_athlete`,`id_epreuve`),
  KEY `fk_part_epreuve` (`id_epreuve`),
  CONSTRAINT `fk_part_athlete` FOREIGN KEY (`id_athlete`) REFERENCES `athlete` (`id_athlete`),
  CONSTRAINT `fk_part_epreuve` FOREIGN KEY (`id_epreuve`) REFERENCES `epreuve` (`id_epreuve`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participation`
--

LOCK TABLES `participation` WRITE;
/*!40000 ALTER TABLE `participation` DISABLE KEYS */;
INSERT INTO `participation` VALUES (1,1,'2026-02-01'),(2,2,'2026-02-02'),(3,1,'2026-02-01'),(5,2,'2026-02-02'),(6,2,'2026-02-02'),(7,3,'2026-02-03'),(8,1,'2026-02-01'),(8,3,'2026-02-03');
/*!40000 ALTER TABLE `participation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pays`
--

DROP TABLE IF EXISTS `pays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pays` (
  `id_pays` int NOT NULL AUTO_INCREMENT,
  `nom_pays` varchar(100) NOT NULL,
  PRIMARY KEY (`id_pays`),
  UNIQUE KEY `nom_pays` (`nom_pays`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pays`
--

LOCK TABLES `pays` WRITE;
/*!40000 ALTER TABLE `pays` DISABLE KEYS */;
INSERT INTO `pays` VALUES (4,'Canada'),(5,'États-Unis'),(1,'France'),(2,'Italie'),(6,'Japon'),(3,'Suisse');
/*!40000 ALTER TABLE `pays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultat`
--

DROP TABLE IF EXISTS `resultat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultat` (
  `id_athlete` int NOT NULL,
  `id_epreuve` int NOT NULL,
  `temps` decimal(10,3) DEFAULT NULL,
  `classement` int DEFAULT NULL,
  PRIMARY KEY (`id_athlete`,`id_epreuve`),
  CONSTRAINT `fk_res_participation` FOREIGN KEY (`id_athlete`, `id_epreuve`) REFERENCES `participation` (`id_athlete`, `id_epreuve`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultat`
--

LOCK TABLES `resultat` WRITE;
/*!40000 ALTER TABLE `resultat` DISABLE KEYS */;
INSERT INTO `resultat` VALUES (1,1,105.320,1),(2,2,76.320,2),(3,1,105.770,2),(5,2,78.450,1),(6,2,75.890,3),(7,3,1.000,1),(8,1,106.100,3),(8,3,140.000,5);
/*!40000 ALTER TABLE `resultat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `nom_role` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `nom_role` (`nom_role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'ADMIN'),(3,'AGENT_BILLETTERIE'),(4,'LECTEUR'),(2,'ORGANISATEUR');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site`
--

DROP TABLE IF EXISTS `site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site` (
  `id_site` int NOT NULL AUTO_INCREMENT,
  `nom_site` varchar(100) NOT NULL,
  `capacite` int NOT NULL,
  PRIMARY KEY (`id_site`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site`
--

LOCK TABLES `site` WRITE;
/*!40000 ALTER TABLE `site` DISABLE KEYS */;
INSERT INTO `site` VALUES (1,'Piste Olympia',2),(2,'Palavela',3),(3,'Mediolanum Forum',2),(4,'Piste Winniza',1000);
/*!40000 ALTER TABLE `site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sport`
--

DROP TABLE IF EXISTS `sport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport` (
  `id_sport` int NOT NULL AUTO_INCREMENT,
  `nom_sport` varchar(100) NOT NULL,
  PRIMARY KEY (`id_sport`),
  UNIQUE KEY `nom_sport` (`nom_sport`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sport`
--

LOCK TABLES `sport` WRITE;
/*!40000 ALTER TABLE `sport` DISABLE KEYS */;
INSERT INTO `sport` VALUES (3,'Hockey sur Glace'),(2,'Patinage Artistique'),(5,'Patinage chronométré'),(1,'Ski Alpin'),(4,'Ski Course');
/*!40000 ALTER TABLE `sport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id_utilisateur` int NOT NULL AUTO_INCREMENT,
  `login` varchar(254) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `id_role` int NOT NULL,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `login` (`login`),
  KEY `fk_utilisateur_role` (`id_role`),
  CONSTRAINT `fk_utilisateur_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'admin@mail.com','$2b$12$PLACEHOLDER_HASH_ADMIN',1),(2,'orga@mail.com','$2b$12$PLACEHOLDER_HASH_ORGA',2),(3,'billetterie@mail.com','$2b$12$PLACEHOLDER_HASH_TICK',3),(4,'lecteur@mail.com','$2b$12$PLACEHOLDER_HASH_READ',4),(5,'admin@gmail.com','$2b$12$BtFiQTawT4KPe5pXdvEhVOHArzpaL5SWuFEU3UQBPzrz7rWDqVFHK',1),(6,'etudiant1@gmail.com','$2b$12$j.Yt0IWtmPQppp8Mfa4JRuHX5LdaVTC6xBrL1n6wfMj/i2VbdqyS6',4);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-08 20:22:37
