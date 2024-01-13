import express from "express";
import licenseRequestController from "../../controllers/departmentOfficer/license_request.controller.js";

const router = express.Router();

router.get("/", licenseRequestController.index);
router.post("/get-ward-by-district", licenseRequestController.getWardByDistrict);
router.post("/get-request-by-ward", licenseRequestController.getRequestByWard);
router.post("/cancel-request", licenseRequestController.cancelRequest);

export default router;
