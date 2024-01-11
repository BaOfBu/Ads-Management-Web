import express from "express";
import providedInfoController from "../../controllers/departmentOfficer/provided_infor.controller.js";

const router = express.Router();

router.get("/:choice", providedInfoController.index);
router.get("/view-detail/:choice", providedInfoController.viewDetailProvidedInfo)
export default router;
