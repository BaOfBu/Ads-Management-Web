import express from "express";
import wardController from "../../controllers/departmentOfficer/ward.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "management";
    next();
};
router.use(setActiveNavItem);

router.get("/", wardController.index);
router.get("/add", wardController.addWard);
router.get("/is-available", wardController.isAvaiable);
router.post("/add", wardController.handle_addWard);
router.get("/edit", wardController.editWard);
router.post("/del", wardController.handle_deleteWard);
router.post("/patch", wardController.handle_editWard);
router.get("/view-detail", wardController.viewDetailWard);

export default router;
