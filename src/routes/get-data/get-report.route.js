import express from "express";
import GetReportLocationController from "../../controllers/departmentOfficer/get-report-location.controller.js";
const router = express.Router();
router.get("/", GetReportLocationController.getReportLocation);
router.get("/byWard",GetReportLocationController.getReportLocationByWard)
export default router;
