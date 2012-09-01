SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

-- -----------------------------------------------------
-- SQL schema to create database for power monitoring
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `power_data`;
USE `power_data`;

-- -----------------------------------------------------
-- Table `power_data`.`power_data_dayaverage`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `power_data`.`power_data_dayaverage` (
  `device` VARCHAR(20) NOT NULL ,
  `watts` INT(4) NOT NULL ,
  `temp` INT(3) DEFAULT NULL ,
  `datetime` DATETIME NOT NULL DEFAULT '2012-01-01 00:00:00' ,
  PRIMARY KEY (`datetime`, `device`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `power_data`.`power_data_records`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `power_data`.`power_data_records` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `device` VARCHAR(20) NOT NULL ,
  `watts` INT(4) NOT NULL ,
  `temp` FLOAT DEFAULT NULL ,
  `datetime` DATETIME NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

