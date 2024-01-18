import express from "express";
import adsLocationModificationRequestController from "../../controllers/departmentOfficer/ads_location_modification_request.controller.js";

const router = express.Router();

router.get("/", adsLocationModificationRequestController.index);
router.post("/get-ward-by-district", adsLocationModificationRequestController.getWardByDistrict);
router.post("/get-request-by-ward", adsLocationModificationRequestController.getRequestByWard);
router.post("/cancel-request", adsLocationModificationRequestController.cancelRequest);
router.post("/accept-request", adsLocationModificationRequestController.acceptRequest);
router.get("/view-detail", adsLocationModificationRequestController.viewDetail);

export default router;
