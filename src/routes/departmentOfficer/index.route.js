import express from "express";
const router = express.Router();

import districtRoutes from "./district.route.js";
import wardRoutes from "./ward.route.js";
import providedInforRoutes from "./provided_infor.route.js";
import adsLocationRoutes from "./ads_location.route.js";
import adsPanelRoutes from "./ads_panel.route.js";
import managementOfficerRoutes from "./management_officer.route.js";

// Middleware to apply default settings to the response locals
function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "departmentOfficer/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.use("/district", districtRoutes);
router.use("/ward", wardRoutes);
router.use("/provided-info", providedInforRoutes);
router.use("/ads-location", adsLocationRoutes);
router.use("/ads-panel", adsPanelRoutes);
router.use("/management-officer", managementOfficerRoutes);
export default router;
