import express from "express";
import GetAdsLocationController from "../../controllers/departmentOfficer/get-ads-location.controller.js";
const router = express.Router();
router.get("/", GetAdsLocationController.getAdsLocation);
router.get("/byWard", GetAdsLocationController.getAdsLocationByWard);
export default router;
