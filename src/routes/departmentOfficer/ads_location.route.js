import express from "express";
import adsLocationController from "../../controllers/departmentOfficer/ads_location.controller.js";

const router = express.Router();

router.get("/", adsLocationController.index);
router.get("/add", adsLocationController.addAdsLocation);
router.post("/del", adsLocationController.handle_deleteAdsLocation);
router.get("/view-detail", adsLocationController.viewDetailAdsLocation);

export default router;
