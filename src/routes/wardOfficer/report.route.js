import express from "express";
import reportController from "../../controllers/wardOfficer/report.controller.js";
const router = express.Router();

router.get("/", reportController.index);
router.get("/viewDetails", reportController.viewDetails);
router.post("/updateStatus", reportController.updateStatus);
export default router;
