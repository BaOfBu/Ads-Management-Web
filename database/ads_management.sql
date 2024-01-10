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

 Date: 10/01/2024 22:44:25
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
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'Ward/District/Department',
  `districtId` int UNSIGNED NOT NULL,
  `wardId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`accountId`) USING BTREE,
  INDEX `FK_account_districtId`(`districtId` ASC) USING BTREE,
  INDEX `FK_account_wardId`(`wardId` ASC) USING BTREE,
  CONSTRAINT `FK_account_districtId` FOREIGN KEY (`districtId`) REFERENCES `district` (`districtId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_account_wardId` FOREIGN KEY (`wardId`) REFERENCES `ward` (`wardId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account
-- ----------------------------
INSERT INTO `account` VALUES (1, 'Tnmchau123', '$2a$10$yPFA61KWxmBjmH7hazn8deK7YsQpfoYaFC2JvfedmUA', 'Trần Ngọc Minh Châu', '2005-04-19', 'chauhhcc@gmail.com', '0367684262', 'Phường', 1, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ads_location
-- ----------------------------
INSERT INTO `ads_location` VALUES (1, '322b Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh, Thành phố Hồ Chí Minh', 10.8034, 106.712, 23, 1, 1, 1, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (2, '60a Xô Viết Nghệ Tĩnh, Phường 19, Bình Thạnh, Thành phố Hồ Chí Minh', 10.795, 106.71, 23, 1, 1, 2, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (3, '293 Đ. Điện Biên Phủ, Phường 21, Bình Thạnh, Thành phố Hồ Chí Minh', 10.801, 106.715, 23, 1, 1, 3, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (4, '533 Đ. Điện Biên Phủ, Phường 25, Bình Thạnh, Thành phố Hồ Chí Minh', 10.8011, 106.716, 23, 1, 1, 4, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (5, '63-65 Đ. Điện Biên Phủ, Phường 15, Bình Thạnh, Thành phố Hồ Chí Minh', 10.8, 106.702, 23, 1, 1, 5, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (6, '60a Xô Viết Nghệ Tĩnh, Phường 19, Bình Thạnh, Thành phố Hồ Chí Minh', 10.7949, 106.71, 24, 1, 1, 6, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (7, '21B Đ. Phan Đăng Lưu, Phường 3, Bình Thạnh, Thành phố Hồ Chí Minh', 10.8032, 106.693, 25, 1, 1, 7, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (8, '23 Nguyễn Huy Tự, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 10.7927, 106.697, 26, 1, 1, 8, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (9, '171 Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1, Thành phố Hồ Chí Minh', 10.771, 106.7, 27, 1, 1, 9, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (10, '79 Đ. Phạm Viết Chánh, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh', 10.7659, 106.682, 28, 1, 1, 10, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (11, '76 Đ. Lê Lai, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh', 10.7711, 106.695, 29, 1, 1, 11, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (12, '120 Đ. Lê Lợi, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh', 10.7727, 106.699, 29, 1, 1, 12, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (13, '199 Nguyễn Thái Học, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh', 10.7692, 106.695, 30, 1, 1, 13, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (14, '122 Đ. Bùi Thị Xuân, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh', 10.7701, 106.688, 30, 1, 1, 14, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (15, '416 Hai Bà Trưng, Phường 8, Quận 3, Thành phố Hồ Chí Minh', 10.7912, 106.688, 31, 1, 1, 15, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (16, '344 Hai Bà Trưng, Phường Tân Định, Quận 1, Thành phố Hồ Chí Minh', 10.7904, 106.689, 32, 1, 1, 16, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (17, '206 Hai Bà Trưng, Phường Tân Định, Quận 1, Thành phố Hồ Chí Minh', 10.7883, 106.692, 32, 1, 1, 17, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (18, '121 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 10.7924, 106.7, 26, 1, 1, 18, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (19, '12D Đ. Cách Mạng Tháng 8, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh', 10.7722, 106.693, 29, 1, 1, 19, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (20, '12 Đ. Nguyễn Trãi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh', 10.7715, 106.693, 30, 1, 1, 20, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (21, '384 Đ. Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, Thành phố Hồ Chí Minh', 10.7911, 106.683, 31, 1, 1, 21, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (22, '256 Đ. Lê Văn Sỹ, Phường 14, Quận 3, Thành phố Hồ Chí Minh', 10.7868, 106.681, 34, 1, 1, 22, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (23, '677 Đ. Điện Biên Phủ, Phường 1, Quận 3, Thành phố Hồ Chí Minh', 10.7682, 106.675, 35, 1, 1, 23, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (24, '232 Đ. Hồng Bàng, Phường 15, Quận 5, Thành phố Hồ Chí Minh', 10.7556, 106.672, 36, 1, 1, 24, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (25, '391 Đ. Trần Phú, Phường 8, Quận 5, Thành phố Hồ Chí Minh', 10.7541, 106.654, 36, 1, 1, 25, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (26, '205 Đ. Nguyễn Văn Cừ, Phường 3, Quận 5, Thành phố Hồ Chí Minh', 10.7598, 106.684, 37, 1, 1, 26, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (27, '37 Bạch Vân, Phường 5, Quận 5, Thành phố Hồ Chí Minh', 10.7522, 106.676, 37, 1, 1, 27, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (28, '460 Nguyễn Tất Thành, Phường 18, Quận 4, Thành phố Hồ Chí Minh', 10.7569, 106.716, 38, 1, 1, 28, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (29, '213 Đ. Khánh Hội, Phường 3, Quận 4, Thành phố Hồ Chí Minh', 10.7585, 106.699, 39, 1, 1, 29, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (30, '96 Nguyễn Tất Thành, Phường 12, Quận 4, Thành phố Hồ Chí Minh', 10.765, 106.707, 40, 1, 1, 30, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (31, '80A Đ. Bến Vân Đồn, Phường 9, Quận 4, Thành phố Hồ Chí Minh', 10.7649, 106.701, 41, 1, 1, 31, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (32, '696b Đ. Kinh Dương Vương, Phường 13, Bình Tân, Thành phố Hồ Chí Minh', 10.7505, 106.629, 42, 1, 1, 32, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (33, '1404 Đ. Võ Văn Kiệt, Phường 1, Quận 6, Thành phố Hồ Chí Minh', 10.7461, 106.653, 43, 1, 1, 33, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (34, '36b Đ. Kinh Dương Vương, Phường 13, Quận 6, Thành phố Hồ Chí Minh', 10.7523, 106.632, 44, 1, 1, 34, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (35, '675 Trần Xuân Soạn, Tân Hưng, Quận 7, Thành phố Hồ Chí Minh', 10.7519, 106.703, 45, 1, 1, 35, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (36, '650 Huỳnh Tấn Phát, Tân Phú, Quận 7, Thành phố Hồ Chí Minh', 10.7343, 106.731, 46, 1, 1, 36, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (37, '297 Huỳnh Tấn Phát, Bình Thuận, Quận 7, Thành phố Hồ Chí Minh', 10.7467, 106.729, 47, 1, 1, 37, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (38, '531 Đ. Sư Vạn Hạnh, Phường 12, Quận 10, Thành phố Hồ Chí Minh', 10.7758, 106.667, 48, 1, 1, 38, 'Chưa quy hoạch');
INSERT INTO `ads_location` VALUES (39, '303A Đ. Cách Mạng Tháng 8, Phường 12, Quận 10, Thành phố Hồ Chí Minh', 10.7797, 106.678, 48, 1, 1, 39, 'Đã quy hoạch');
INSERT INTO `ads_location` VALUES (40, '255 Đ. Nguyễn Tri Phương, Phường 5, Quận 10, Thành phố Hồ Chí Minh', 10.7604, 106.669, 49, 1, 1, 40, 'Chưa quy hoạch');

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
-- Records of ads_panel
-- ----------------------------

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
-- Records of ads_panel_type
-- ----------------------------

-- ----------------------------
-- Table structure for ads_type
-- ----------------------------
DROP TABLE IF EXISTS `ads_type`;
CREATE TABLE `ads_type`  (
  `adsTypeId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`adsTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ads_type
-- ----------------------------
INSERT INTO `ads_type` VALUES (1, 'Cổ động chính trị', NULL);

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
-- Records of citizen_report
-- ----------------------------

-- ----------------------------
-- Table structure for district
-- ----------------------------
DROP TABLE IF EXISTS `district`;
CREATE TABLE `district`  (
  `districtId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`districtId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of district
-- ----------------------------
INSERT INTO `district` VALUES (1, '1', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaâ');
INSERT INTO `district` VALUES (2, '2', NULL);
INSERT INTO `district` VALUES (3, '3', '');
INSERT INTO `district` VALUES (4, '4', '');
INSERT INTO `district` VALUES (5, '5', '');
INSERT INTO `district` VALUES (6, '6', '');
INSERT INTO `district` VALUES (7, '7', '');
INSERT INTO `district` VALUES (8, '8', '');
INSERT INTO `district` VALUES (9, '9', '');
INSERT INTO `district` VALUES (10, '10', '');
INSERT INTO `district` VALUES (11, '11', '');
INSERT INTO `district` VALUES (12, '12', '');
INSERT INTO `district` VALUES (13, 'Thủ Đức', '');
INSERT INTO `district` VALUES (14, 'Bình Thạnh', '');
INSERT INTO `district` VALUES (15, 'Bình Chánh', '');

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
-- Records of edit_ads_location_request
-- ----------------------------

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
-- Records of edit_ads_panel_request
-- ----------------------------

-- ----------------------------
-- Table structure for image
-- ----------------------------
DROP TABLE IF EXISTS `image`;
CREATE TABLE `image`  (
  `imgId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `imgLink` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`imgId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of image
-- ----------------------------
INSERT INTO `image` VALUES (1, '/static/images/ads-location/1.png');
INSERT INTO `image` VALUES (2, '/static/images/ads-location/2.png');
INSERT INTO `image` VALUES (3, '/static/images/ads-location/3.png');
INSERT INTO `image` VALUES (4, '/static/images/ads-location/4.png');
INSERT INTO `image` VALUES (5, '/static/images/ads-location/5.png');
INSERT INTO `image` VALUES (6, '/static/images/ads-location/6.png');
INSERT INTO `image` VALUES (7, '/static/images/ads-location/7.png');
INSERT INTO `image` VALUES (8, '/static/images/ads-location/8.png');
INSERT INTO `image` VALUES (9, '/static/images/ads-location/9.png');
INSERT INTO `image` VALUES (10, '/static/images/ads-location/10.png');
INSERT INTO `image` VALUES (11, '/static/images/ads-location/11.png');
INSERT INTO `image` VALUES (12, '/static/images/ads-location/12.png');
INSERT INTO `image` VALUES (13, '/static/images/ads-location/13.png');
INSERT INTO `image` VALUES (14, '/static/images/ads-location/14.png');
INSERT INTO `image` VALUES (15, '/static/images/ads-location/15.png');
INSERT INTO `image` VALUES (16, '/static/images/ads-location/16.png');
INSERT INTO `image` VALUES (17, '/static/images/ads-location/17.png');
INSERT INTO `image` VALUES (18, '/static/images/department-officer/ads-location/18.png');
INSERT INTO `image` VALUES (19, '/static/images/department-officer/ads-location/19.png');
INSERT INTO `image` VALUES (20, '/static/images/department-officer/ads-location/20.png');
INSERT INTO `image` VALUES (21, '/static/images/department-officer/ads-location/21.png');
INSERT INTO `image` VALUES (22, '/static/images/department-officer/ads-location/22.png');
INSERT INTO `image` VALUES (23, '/static/images/department-officer/ads-location/23.png');
INSERT INTO `image` VALUES (24, '/static/images/department-officer/ads-location/24.png');
INSERT INTO `image` VALUES (25, '/static/images/department-officer/ads-location/25.png');
INSERT INTO `image` VALUES (26, '/static/images/department-officer/ads-location/26.png');
INSERT INTO `image` VALUES (27, '/static/images/department-officer/ads-location/27.png');
INSERT INTO `image` VALUES (28, '/static/images/department-officer/ads-location/28.png');
INSERT INTO `image` VALUES (29, '/static/images/department-officer/ads-location/29.png');
INSERT INTO `image` VALUES (30, '/static/images/department-officer/ads-location/30.png');
INSERT INTO `image` VALUES (31, '/static/images/department-officer/ads-location/31.png');
INSERT INTO `image` VALUES (32, '/static/images/department-officer/ads-location/32.png');
INSERT INTO `image` VALUES (33, '/static/images/department-officer/ads-location/33.png');
INSERT INTO `image` VALUES (34, '/static/images/department-officer/ads-location/34.png');
INSERT INTO `image` VALUES (35, '/static/images/department-officer/ads-location/35.png');
INSERT INTO `image` VALUES (36, '/static/images/department-officer/ads-location/36.png');
INSERT INTO `image` VALUES (37, '/static/images/department-officer/ads-location/37.png');
INSERT INTO `image` VALUES (38, '/static/images/department-officer/ads-location/38.png');
INSERT INTO `image` VALUES (39, '/static/images/department-officer/ads-location/39.png');
INSERT INTO `image` VALUES (40, '/static/images/department-officer/ads-location/40.png');

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
-- Records of license_request
-- ----------------------------

-- ----------------------------
-- Table structure for location_type
-- ----------------------------
DROP TABLE IF EXISTS `location_type`;
CREATE TABLE `location_type`  (
  `locationTypeId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  PRIMARY KEY (`locationTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of location_type
-- ----------------------------
INSERT INTO `location_type` VALUES (1, 'Đất công', NULL);
INSERT INTO `location_type` VALUES (2, 'Công viên', NULL);
INSERT INTO `location_type` VALUES (3, 'Hành lang an toàn giao thông', NULL);

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
-- Records of report_type
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ward
-- ----------------------------
INSERT INTO `ward` VALUES (1, '1', NULL, 1);
INSERT INTO `ward` VALUES (2, '2', NULL, 1);
INSERT INTO `ward` VALUES (3, '3', NULL, 1);
INSERT INTO `ward` VALUES (4, '4', NULL, 1);
INSERT INTO `ward` VALUES (5, '5', NULL, 1);
INSERT INTO `ward` VALUES (6, '6', NULL, 1);
INSERT INTO `ward` VALUES (7, '7', NULL, 1);
INSERT INTO `ward` VALUES (8, '8', NULL, 1);
INSERT INTO `ward` VALUES (9, '9', NULL, 1);
INSERT INTO `ward` VALUES (10, '10', NULL, 1);
INSERT INTO `ward` VALUES (11, '11', NULL, 1);
INSERT INTO `ward` VALUES (12, '12', NULL, 1);
INSERT INTO `ward` VALUES (13, '13', NULL, 1);
INSERT INTO `ward` VALUES (14, '14', NULL, 1);
INSERT INTO `ward` VALUES (15, '15', NULL, 1);
INSERT INTO `ward` VALUES (16, '16', NULL, 1);
INSERT INTO `ward` VALUES (17, '17', NULL, 1);
INSERT INTO `ward` VALUES (18, '18', NULL, 1);
INSERT INTO `ward` VALUES (19, '19', NULL, 1);
INSERT INTO `ward` VALUES (20, '20', NULL, 1);
INSERT INTO `ward` VALUES (21, '21', NULL, 1);
INSERT INTO `ward` VALUES (22, '22', NULL, 1);
INSERT INTO `ward` VALUES (23, '25', NULL, 14);
INSERT INTO `ward` VALUES (24, '19', NULL, 14);
INSERT INTO `ward` VALUES (25, '3', NULL, 14);
INSERT INTO `ward` VALUES (26, 'Đa Kao', NULL, 1);
INSERT INTO `ward` VALUES (27, 'Nguyễn Thái Bình', NULL, 1);
INSERT INTO `ward` VALUES (28, 'Nguyễn Cư Trinh', NULL, 1);
INSERT INTO `ward` VALUES (29, 'Bến Thành', NULL, 1);
INSERT INTO `ward` VALUES (30, 'Phạm Ngũ Lão', NULL, 1);
INSERT INTO `ward` VALUES (31, '8', NULL, 3);
INSERT INTO `ward` VALUES (32, 'Tân Định', NULL, 1);
INSERT INTO `ward` VALUES (34, '14', NULL, 3);
INSERT INTO `ward` VALUES (35, '1', NULL, 3);
INSERT INTO `ward` VALUES (36, '15', NULL, 5);
INSERT INTO `ward` VALUES (37, '5', NULL, 5);
INSERT INTO `ward` VALUES (38, '18', NULL, 4);
INSERT INTO `ward` VALUES (39, '3', NULL, 4);
INSERT INTO `ward` VALUES (40, '12', NULL, 4);
INSERT INTO `ward` VALUES (41, '9', NULL, 4);
INSERT INTO `ward` VALUES (42, 'Bình Tân', NULL, 6);
INSERT INTO `ward` VALUES (43, '1', NULL, 6);
INSERT INTO `ward` VALUES (44, '13', NULL, 6);
INSERT INTO `ward` VALUES (45, 'Tân Hưng', NULL, 7);
INSERT INTO `ward` VALUES (46, 'Tân Phú', NULL, 7);
INSERT INTO `ward` VALUES (47, 'Bình Thuận', NULL, 7);
INSERT INTO `ward` VALUES (48, '12', NULL, 10);
INSERT INTO `ward` VALUES (49, '5', NULL, 10);

SET FOREIGN_KEY_CHECKS = 1;
