import express from "express";
import licenseRequestController from "../../controllers/departmentOfficer/license_request.controller.js";

const router = express.Router();

router.get("/", licenseRequestController.index);

export default router;
