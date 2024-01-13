import express from "express";
import adsLocationModificationRequestController from "../../controllers/departmentOfficer/ads_location_modification_request.controller.js";

const router = express.Router();

router.get("/", adsLocationModificationRequestController.index);
router.post("/get-ward-by-district", adsLocationModificationRequestController.getWardByDistrict);
router.post("/get-request-by-ward", adsLocationModificationRequestController.getRequestByWard);

export default router;
