import express from "express";
import citizenReportController from "../../controllers/departmentOfficer/citizen_report.controller.js";

const router = express.Router();

router.get("/", citizenReportController.index);

export default router;
