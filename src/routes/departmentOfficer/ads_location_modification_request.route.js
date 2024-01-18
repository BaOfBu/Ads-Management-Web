import express from "express";
import adsLocationModificationRequestController from "../../controllers/departmentOfficer/ads_location_modification_request.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "request";
    next();
};
router.use(setActiveNavItem);

router.get("/", adsLocationModificationRequestController.index);
router.post("/get-ward-by-district", adsLocationModificationRequestController.getWardByDistrict);
router.post("/get-request-by-ward", adsLocationModificationRequestController.getRequestByWard);
router.post("/cancel-request", adsLocationModificationRequestController.cancelRequest);
router.post("/accept-request", adsLocationModificationRequestController.acceptRequest);

export default router;
