import express from "express";
import adsPanelController from "../../controllers/departmentOfficer/ads_panel.controller.js";

const router = express.Router();

router.get("/", adsPanelController.index);
router.get("/view-detail", adsPanelController.viewDetailAdsPanel);
router.get("/add", adsPanelController.addAdsPanel);
router.post("/add", adsPanelController.handle_addAdsPanel);
router.post("/upload-image", adsPanelController.uploadImage);

export default router;
