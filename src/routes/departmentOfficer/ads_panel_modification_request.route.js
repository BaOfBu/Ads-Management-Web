import express from "express";
import adsPanelModificationRequestController from "../../controllers/departmentOfficer/ads_panel_modification_request.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "request";
    next();
};
router.use(setActiveNavItem);

router.get("/", adsPanelModificationRequestController.index);
router.post("/get-ward-by-district", adsPanelModificationRequestController.getWardByDistrict);
router.post("/get-request-by-ward", adsPanelModificationRequestController.getRequestByWard);
router.post("/cancel-request", adsPanelModificationRequestController.cancelRequest);
router.post("/accept-request", adsPanelModificationRequestController.acceptRequest);

export default router;
