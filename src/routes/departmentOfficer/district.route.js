import express from "express";
import districtController from "../../controllers/departmentOfficer/district.controller.js";

const router = express.Router();

router.get("/", districtController.index);
router.get("/add", districtController.addDistrict);
router.get("/is-available", districtController.isAvaiable);
router.post("/add", districtController.handle_addDistrict);
router.get("/edit", districtController.editDistrict);
router.post("/del", districtController.handle_deleteDistrict);
router.post("/patch", districtController.handle_editDistrict);
router.get("/view-detail", districtController.viewDetailDistrict);

export default router;
