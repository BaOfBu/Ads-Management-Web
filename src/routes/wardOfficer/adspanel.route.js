import express from "express";
import adsPanelController from "../../controllers/wardOfficer/ads_panel.controller.js";
const router = express.Router();

router.get("/", adsPanelController.index);
router.get("/view-panel-detail", adsPanelController.viewPanelDetails);
router.get("/ads-panel-edit", adsPanelController.getEditAdsPanel);
router.post("/ads-panel-edit", adsPanelController.postEditAdsPanel);

export default router;