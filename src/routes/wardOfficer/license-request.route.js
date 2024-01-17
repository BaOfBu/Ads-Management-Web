import express from "express";
import licenseController from "../../controllers/wardOfficer/license_request.controller.js";
const router = express.Router();

router.get("/", licenseController.index);

export default router;