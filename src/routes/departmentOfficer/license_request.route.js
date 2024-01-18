import express from "express";
import licenseRequestController from "../../controllers/departmentOfficer/license_request.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "request";
    next();
};
router.use(setActiveNavItem);
router.get("/", licenseRequestController.index);
router.post("/get-ward-by-district", licenseRequestController.getWardByDistrict);
router.post("/get-request-by-ward", licenseRequestController.getRequestByWard);
router.post("/cancel-request", licenseRequestController.cancelRequest);
router.post("/accept-request", licenseRequestController.acceptRequest);
router.get("/view-detail", licenseRequestController.viewDetail);

export default router;
