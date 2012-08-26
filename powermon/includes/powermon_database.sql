-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Aug 26, 2012 at 10:04 AM
-- Server version: 5.1.61
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
-- --------------------------------------------------------

--
-- Table structure for table `power_data_dayaverage`
--

CREATE TABLE IF NOT EXISTS `power_data_dayaverage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device` varchar(20) NOT NULL,
  `watts` int(4) DEFAULT NULL,
  `temp` int(3) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=494 ;


-- --------------------------------------------------------

--
-- Table structure for table `power_data_records`
--

CREATE TABLE IF NOT EXISTS `power_data_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device` varchar(20) COLLATE latin1_general_ci NOT NULL,
  `watts` int(4) DEFAULT NULL,
  `temp` float DEFAULT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=95161 ;

-- --------------------------------------------------------

--
-- Table structure for table `power_devices`
--

CREATE TABLE IF NOT EXISTS `power_devices` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE latin1_general_ci NOT NULL,
  `owner` varchar(32) COLLATE latin1_general_ci NOT NULL,
  `type` varchar(32) COLLATE latin1_general_ci NOT NULL,
  `icon` varchar(32) COLLATE latin1_general_ci NOT NULL,
  `comment` varchar(32) COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=5 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
