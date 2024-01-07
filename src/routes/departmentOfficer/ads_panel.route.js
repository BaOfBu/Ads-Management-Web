import express from "express";
import adsPanelController from "../../controllers/departmentOfficer/ads_panel.controller.js";

const router = express.Router();

router.get("/", adsPanelController.index);

export default router;
