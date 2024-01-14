import express from "express";
import GetAdsLocationController from "../../controllers/departmentOfficer/get-ads-location.controller.js";
const router = express.Router();
router.use("/", GetAdsLocationController.getAdsLocation);
export default router;
