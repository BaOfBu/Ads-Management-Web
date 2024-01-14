import express from "express";
import reportCitizenController from "../../controllers/departmentOfficer/report_citizen.controller.js";

const router = express.Router();

router.get("/", reportCitizenController.index);

export default router;
