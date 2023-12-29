import express from "express";
import managementOfficerController from "../../controllers/departmentOfficer/management_officer.controller.js";

const router = express.Router();

router.get("/", managementOfficerController.index);
router.get("/register", managementOfficerController.register);
router.get("/list-ward", managementOfficerController.list_ward);
router.get("/is-available", managementOfficerController.isAvaiable);
router.post("/register", managementOfficerController.handle_register);

export default router;
