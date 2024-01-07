import express from "express";
import adsLocationController from "../../controllers/departmentOfficer/ads_location.controller.js";

const router = express.Router();

router.get("/", adsLocationController.index);

export default router;
