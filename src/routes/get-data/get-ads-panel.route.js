import express from "express";
import GetAddPanelController from "../../controllers/departmentOfficer/get-ads-panel.controller.js";
const router = express.Router();
// [GET]/get-data/get-ads-panel
router.use("/", GetAddPanelController.getAdsPanel);
export default router;
