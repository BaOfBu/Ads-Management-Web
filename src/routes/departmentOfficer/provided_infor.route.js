import express from "express";
import providedInforController from "../../controllers/departmentOfficer/provided_infor.controller.js";

const router = express.Router();

router.get("/:choice", providedInforController.index);

export default router;
