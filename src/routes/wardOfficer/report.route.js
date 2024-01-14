import express from "express";
import reportController from "../../controllers/wardOfficer/report.controller.js";
const router = express.Router();

router.get("/", reportController.index);
router.get("/viewDetails", reportController.viewDetails);
export default router;
