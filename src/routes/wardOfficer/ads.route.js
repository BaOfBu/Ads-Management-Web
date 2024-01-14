import express from "express";
import adsController from "../../controllers/wardOfficer/ads.controller.js";
const router = express.Router();

router.get("/", adsController.index);
router.get("/view-detail", adsController.viewDetails);
router.get("/view-panel-detail", adsController.viewPanelDetails);
router.get("/ads-location-edit", adsController.getEditAdsLocation);
router.get("/ads-panel-edit", adsController.getEditAdsPanel);
export default router;
