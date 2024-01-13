import express from "express";
import adsPanelModificationRequestController from "../../controllers/departmentOfficer/ads_panel_modification_request.controller.js";

const router = express.Router();

router.get("/", adsPanelModificationRequestController.index);

export default router;
