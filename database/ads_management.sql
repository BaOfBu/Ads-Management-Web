/*
 Navicat Premium Data Transfer

 Source Server         : mchau
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : ads_management

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 27/12/2023 06:30:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account`  (
  `accountId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(6) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'Phường/Quận/Sở',
  `districtId` int UNSIGNED NOT NULL,
  `wardId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`accountId`) USING BTREE,
  INDEX `FK_account_districtId`(`districtId` ASC) USING BTREE,
  INDEX `FK_account_wardId`(`wardId` ASC) USING BTREE,
  CONSTRAINT `FK_account_districtId` FOREIGN KEY (`districtId`) REFERENCES `district` (`districtId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_account_wardId` FOREIGN KEY (`wardId`) REFERENCES `ward` (`wardId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ads_location
-- ----------------------------
DROP TABLE IF EXISTS `ads_location`;
CREATE TABLE `ads_location`  (
  `adsLocationId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `location` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `lat` float NOT NULL,
  `long` float NOT NULL,
  `wardId` int UNSIGNED NOT NULL,
  `locationType` int UNSIGNED NOT NULL,
  `adsType` int UNSIGNED NOT NULL,
  `imgId` int UNSIGNED NOT NULL,
  `status` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`adsLocationId`) USING BTREE,
  INDEX `FK_adsLocation_wardId`(`wardId` ASC) USING BTREE,
  INDEX `FK_adsLocation_locationTypeId`(`locationType` ASC) USING BTREE,
  INDEX `FK_adsLocation_adsType`(`adsType` ASC) USING BTREE,
  INDEX `FK_adsLocation_imgId`(`imgId` ASC) USING BTREE,
  CONSTRAINT `FK_adsLocation_adsType` FOREIGN KEY (`adsType`) REFERENCES `ads_type` (`adsTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_adsLocation_imgId` FOREIGN KEY (`imgId`) REFERENCES `image` (`imgId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_adsLocation_locationTypeId` FOREIGN KEY (`locationType`) REFERENCES `location_type` (`locationTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_adsLocation_wardId` FOREIGN KEY (`wardId`) REFERENCES `ward` (`wardId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ads_panel
-- ----------------------------
DROP TABLE IF EXISTS `ads_panel`;
CREATE TABLE `ads_panel`  (
  `adsPanelId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `adsLocationId` int UNSIGNED NOT NULL,
  `adsPanelTypeId` int UNSIGNED NOT NULL,
  `width` float NOT NULL,
  `height` float NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `imgId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`adsPanelId`) USING BTREE,
  INDEX `FK_adsPanel_adsLocationId`(`adsLocationId` ASC) USING BTREE,
  INDEX `FK_adsPanel_adsPanelTypeId`(`adsPanelTypeId` ASC) USING BTREE,
  INDEX `FK_adsPanel_imgId`(`imgId` ASC) USING BTREE,
  CONSTRAINT `FK_adsPanel_adsLocationId` FOREIGN KEY (`adsLocationId`) REFERENCES `ads_location` (`adsLocationId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_adsPanel_adsPanelTypeId` FOREIGN KEY (`adsPanelTypeId`) REFERENCES `ads_panel_type` (`adsPanelTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_adsPanel_imgId` FOREIGN KEY (`imgId`) REFERENCES `image` (`imgId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ads_panel_type
-- ----------------------------
DROP TABLE IF EXISTS `ads_panel_type`;
CREATE TABLE `ads_panel_type`  (
  `adsPanelTypeId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`adsPanelTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ads_type
-- ----------------------------
DROP TABLE IF EXISTS `ads_type`;
CREATE TABLE `ads_type`  (
  `adsTypeId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`adsTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for citizen_report
-- ----------------------------
DROP TABLE IF EXISTS `citizen_report`;
CREATE TABLE `citizen_report`  (
  `citizenReportId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `long` float NOT NULL,
  `lat` float NOT NULL,
  `location` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `reportTypeId` int UNSIGNED NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `imgId` int UNSIGNED NOT NULL,
  `sendDate` datetime NOT NULL,
  `status` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'Đang xử lý/Đã xử lý xong',
  `handlingProcedureInfor` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  `adsPanelId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`citizenReportId`) USING BTREE,
  INDEX `FK_citizenReport_reportTypeId`(`reportTypeId` ASC) USING BTREE,
  INDEX `citizenReport_ImgId`(`imgId` ASC) USING BTREE,
  INDEX `citizenReport_adsPanelId`(`adsPanelId` ASC) USING BTREE,
  CONSTRAINT `FK_citizenReport_reportTypeId` FOREIGN KEY (`reportTypeId`) REFERENCES `report_type` (`reportTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `citizenReport_ImgId` FOREIGN KEY (`imgId`) REFERENCES `image` (`imgId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `citizenReport_adsPanelId` FOREIGN KEY (`adsPanelId`) REFERENCES `ads_panel` (`adsPanelId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for district
-- ----------------------------
DROP TABLE IF EXISTS `district`;
CREATE TABLE `district`  (
  `districtId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`districtId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for edit_ads_location_request
-- ----------------------------
DROP TABLE IF EXISTS `edit_ads_location_request`;
CREATE TABLE `edit_ads_location_request`  (
  `requestId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `requestTime` datetime NOT NULL,
  `senderId` int UNSIGNED NOT NULL,
  `requestReason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `adsLocationId` int UNSIGNED NOT NULL,
  `location` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `lat` float NOT NULL,
  `long` float NOT NULL,
  `wardId` int UNSIGNED NOT NULL,
  `adsLocationTypeId` int UNSIGNED NOT NULL,
  `adsTypeId` int UNSIGNED NOT NULL,
  `imgId` int UNSIGNED NOT NULL,
  `status` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`requestId`) USING BTREE,
  INDEX `FK_editAdsLocationRequest_senderId`(`senderId` ASC) USING BTREE,
  INDEX `FK_editAdsLocationRequest_adsLocationId`(`adsLocationId` ASC) USING BTREE,
  INDEX `FK_editAdsLocationRequest_wardId`(`wardId` ASC) USING BTREE,
  INDEX `FK_editAdsLocationRequest_adsLocationTypeId`(`adsLocationTypeId` ASC) USING BTREE,
  INDEX `FK_editAdsLocationRequest_adsTypeId`(`adsTypeId` ASC) USING BTREE,
  INDEX `FK_editAdsLocationRequest_imgId`(`imgId` ASC) USING BTREE,
  CONSTRAINT `FK_editAdsLocationRequest_adsLocationId` FOREIGN KEY (`adsLocationId`) REFERENCES `ads_location` (`adsLocationId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsLocationRequest_adsLocationTypeId` FOREIGN KEY (`adsLocationTypeId`) REFERENCES `location_type` (`locationTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsLocationRequest_adsTypeId` FOREIGN KEY (`adsTypeId`) REFERENCES `ads_type` (`adsTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsLocationRequest_imgId` FOREIGN KEY (`imgId`) REFERENCES `image` (`imgId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsLocationRequest_senderId` FOREIGN KEY (`senderId`) REFERENCES `account` (`accountId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsLocationRequest_wardId` FOREIGN KEY (`wardId`) REFERENCES `ward` (`wardId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for edit_ads_panel_request
-- ----------------------------
DROP TABLE IF EXISTS `edit_ads_panel_request`;
CREATE TABLE `edit_ads_panel_request`  (
  `requestId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `requestTime` datetime NOT NULL,
  `senderId` int UNSIGNED NOT NULL,
  `requestReason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `adsPanelId` int UNSIGNED NOT NULL,
  `adsLocationId` int UNSIGNED NOT NULL,
  `adsPanelTypeId` int UNSIGNED NOT NULL,
  `width` float NOT NULL,
  `height` float NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `imgId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`requestId`) USING BTREE,
  INDEX `FK_editAdsPanelRequest_adsPanelId`(`adsPanelId` ASC) USING BTREE,
  INDEX `FK_editAdsPanelRequest_adsLocationId`(`adsLocationId` ASC) USING BTREE,
  INDEX `FK_editAdsPanelRequest_adsPanelTypeId`(`adsPanelTypeId` ASC) USING BTREE,
  INDEX `FK_editAdsPanelRequest_imgId`(`imgId` ASC) USING BTREE,
  INDEX `FK_editAdsPanelRequest_senderId`(`senderId` ASC) USING BTREE,
  CONSTRAINT `FK_editAdsPanelRequest_adsLocationId` FOREIGN KEY (`adsLocationId`) REFERENCES `ads_location` (`adsLocationId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsPanelRequest_adsPanelId` FOREIGN KEY (`adsPanelId`) REFERENCES `ads_panel` (`adsPanelId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsPanelRequest_adsPanelTypeId` FOREIGN KEY (`adsPanelTypeId`) REFERENCES `ads_panel_type` (`adsPanelTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsPanelRequest_imgId` FOREIGN KEY (`imgId`) REFERENCES `image` (`imgId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_editAdsPanelRequest_senderId` FOREIGN KEY (`senderId`) REFERENCES `account` (`accountId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for image
-- ----------------------------
DROP TABLE IF EXISTS `image`;
CREATE TABLE `image`  (
  `imgId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `imgLink` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`imgId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for license_request
-- ----------------------------
DROP TABLE IF EXISTS `license_request`;
CREATE TABLE `license_request`  (
  `licenseRequestId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `adsPanelId` int UNSIGNED NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `imgId` int UNSIGNED NOT NULL,
  `nameCompany` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phoneCompany` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `emailCompany` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `locationCompany` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `status` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`licenseRequestId`) USING BTREE,
  INDEX `FK_license_adsPanelId`(`adsPanelId` ASC) USING BTREE,
  INDEX `FK_license_imgId`(`imgId` ASC) USING BTREE,
  CONSTRAINT `FK_license_adsPanelId` FOREIGN KEY (`adsPanelId`) REFERENCES `ads_panel` (`adsPanelId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_license_imgId` FOREIGN KEY (`imgId`) REFERENCES `image` (`imgId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for location_type
-- ----------------------------
DROP TABLE IF EXISTS `location_type`;
CREATE TABLE `location_type`  (
  `locationTypeId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`locationTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for report_type
-- ----------------------------
DROP TABLE IF EXISTS `report_type`;
CREATE TABLE `report_type`  (
  `reportTypeId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`reportTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ward
-- ----------------------------
DROP TABLE IF EXISTS `ward`;
CREATE TABLE `ward`  (
  `wardId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  `districtId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`wardId`) USING BTREE,
  INDEX `FK_ward_districtId`(`districtId` ASC) USING BTREE,
  CONSTRAINT `FK_ward_districtId` FOREIGN KEY (`districtId`) REFERENCES `district` (`districtId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
