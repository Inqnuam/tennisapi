-- MariaDB dump 10.19  Distrib 10.5.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Tennis
-- ------------------------------------------------------
-- Server version	10.5.13-MariaDB-1:10.5.13+maria~buster

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `Tennis`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Tennis` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `Tennis`;

--
-- Table structure for table `Players`
--

DROP TABLE IF EXISTS `Players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Players` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `picture` text NOT NULL,
  `birthday` bigint(20) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `countryCode` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `countryCode` (`countryCode`),
  CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`countryCode`) REFERENCES `countries` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Players`
--

LOCK TABLES `Players` WRITE;
/*!40000 ALTER TABLE `Players` DISABLE KEYS */;
INSERT INTO `Players` VALUES (17,'Rafael','Nadal','https://data.latelier.co/training/tennis_stats/resources/Nadal.png',518140800000,'M','ESP'),(52,'Novak','Djokovic','https://data.latelier.co/training/tennis_stats/resources/Djokovic.png',548640000000,'M','SRB'),(65,'Stan','Wawrinka','https://data.latelier.co/training/tennis_stats/resources/Wawrinka.png',480816000000,'M','SUI'),(95,'Venus','Williams','https://data.latelier.co/training/tennis_stats/resources/Venus.webp',330048000000,'F','USA'),(102,'Serena','Williams','https://data.latelier.co/training/tennis_stats/resources/Serena.png',370310400000,'F','USA');
/*!40000 ALTER TABLE `Players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `countries` (
  `code` varchar(3) NOT NULL,
  `picture` varchar(255) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES ('ESP','https://data.latelier.co/training/tennis_stats/resources/Espagne.png'),('SRB','https://data.latelier.co/training/tennis_stats/resources/Serbie.png'),('SUI','https://data.latelier.co/training/tennis_stats/resources/Suisse.png'),('USA','https://data.latelier.co/training/tennis_stats/resources/USA.png');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rank` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `PlayerId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PlayerId` (`PlayerId`),
  CONSTRAINT `data_ibfk_1` FOREIGN KEY (`PlayerId`) REFERENCES `Players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data`
--

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;
INSERT INTO `data` VALUES (1,2,2542,80000,188,52),(2,52,1105,74000,185,95),(3,21,1784,81000,183,65),(4,10,3521,72000,175,102),(5,1,1982,85000,185,17);
/*!40000 ALTER TABLE `data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `games` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `result` int(11) NOT NULL,
  `datumId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `datumId` (`datumId`),
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`datumId`) REFERENCES `data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,1,1),(2,1,1),(3,1,1),(4,1,1),(5,1,1),(6,0,2),(7,1,2),(8,0,2),(9,1,2),(10,0,2),(11,1,3),(12,1,3),(13,1,3),(14,1,3),(15,0,3),(16,0,4),(17,1,4),(18,1,4),(19,0,4),(20,1,4),(21,1,5),(22,0,5),(23,0,5),(24,1,5),(25,0,5);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-20 22:46:24
