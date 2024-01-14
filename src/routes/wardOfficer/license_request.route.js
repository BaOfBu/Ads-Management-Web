import express from "express";
import licenseRequestController from "../../controllers/wardOfficer/license_request.controller.js";

const router = express.Router();

router.get("/", licenseRequestController.index);
router.post("/cancel-request", licenseRequestController.cancelRequest);
router.get("/add", licenseRequestController.addNewRequest);

export default router;
