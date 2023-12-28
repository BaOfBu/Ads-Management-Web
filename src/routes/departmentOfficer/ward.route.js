import express from "express";
import wardController from "../../controllers/departmentOfficer/ward.controller.js";

const router = express.Router();

router.get("/:districtId", wardController.index);

export default router;
