import express from "express";
import adsLocationModificationRequestController from "../../controllers/departmentOfficer/ads_location_modification_request.controller.js";

const router = express.Router();

router.get("/", adsLocationModificationRequestController.index);

export default router;
