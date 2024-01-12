import express from "express";
import SendReportController from "../../controllers/departmentOfficer/send-report.controller.js";
const router = express.Router();
// [GET]/get-data/send-report
router.use("/", SendReportController.saveReport);
export default router;
