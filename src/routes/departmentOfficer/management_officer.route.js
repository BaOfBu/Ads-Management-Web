import express from "express";
import managementOfficerController from "../../controllers/departmentOfficer/management_officer.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "officer";
    next();
};
router.use(setActiveNavItem);
router.get("/", managementOfficerController.index);
router.get("/register", managementOfficerController.register);
router.get("/list-ward", managementOfficerController.list_ward);
router.get("/is-available", managementOfficerController.isAvaiable);
router.post("/register", managementOfficerController.handle_register);
router.get("/list-officer", managementOfficerController.list_officer);
router.get("/arrage",managementOfficerController.arrage)

export default router;
