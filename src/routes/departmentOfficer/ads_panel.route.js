import express from "express";
import adsPanelController from "../../controllers/departmentOfficer/ads_panel.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "management";
    next();
};
router.use(setActiveNavItem);
router.get("/", adsPanelController.index);
router.get("/view-detail", adsPanelController.viewDetailAdsPanel);
router.get("/add", adsPanelController.addAdsPanel);
router.post("/add", adsPanelController.handle_addAdsPanel);
// router.post("/upload-image", adsPanelController.uploadImage);
router.get("/edit", adsPanelController.editAdsPanel);
router.post("/del", adsPanelController.handle_deleteAdsPanel);
router.post("/patch", adsPanelController.handle_editAdsPanel);

export default router;
