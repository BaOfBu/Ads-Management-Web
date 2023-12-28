import express from "express";
import managementOfficerController from "../../controllers/departmentOfficer/management_officer.controller.js";

const router = express.Router();

router.get("/", managementOfficerController.index);

export default router;
