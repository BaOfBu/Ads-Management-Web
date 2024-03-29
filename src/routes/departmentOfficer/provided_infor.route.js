import express from "express";
import providedInfoController from "../../controllers/departmentOfficer/provided_infor.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "management";
    next();
};
router.use(setActiveNavItem);
router.get("/:choice", providedInfoController.index);
router.get("/view-detail/:choice", providedInfoController.viewDetailProvidedInfo);
router.get("/add/:choice", providedInfoController.addType);
router.get("/is-available/:choice", providedInfoController.isAvailable);
router.post("/add/:choice", providedInfoController.handle_addType);
router.get("/edit/:choice", providedInfoController.editType);
router.post("/del/:choice", providedInfoController.handle_deleteType);
router.post("/patch/:choice", providedInfoController.handle_editType);

export default router;
