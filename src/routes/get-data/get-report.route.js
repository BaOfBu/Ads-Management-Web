import express from "express";
import GetReportLocationController from "../../controllers/departmentOfficer/get-report-location.controller.js";
const router = express.Router();
router.use("/", GetReportLocationController.getReportLocation);
export default router;
