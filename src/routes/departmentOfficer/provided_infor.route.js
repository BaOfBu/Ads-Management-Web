import express from "express";
import providedInfoController from "../../controllers/departmentOfficer/provided_infor.controller.js";

const router = express.Router();

router.get("/:choice", providedInfoController.index);
router.get("/view-detail/:choice", providedInfoController.viewDetailProvidedInfo);
router.get("/add/:choice", providedInfoController.addType);
router.get("/is-available/:choice", providedInfoController.isAvailable);
router.post("/add/:choice", providedInfoController.handle_addType);

export default router;
