import express from "express";
import citizenReportController from "../../controllers/departmentOfficer/citizen_report.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "citizen-report";
    next();
};
router.use(setActiveNavItem);

router.get("/", citizenReportController.index);
router.post("/get-ward-by-district", citizenReportController.getWardByDistrict);
router.post("/get-report-by-ward", citizenReportController.getReportByWard);

export default router;
