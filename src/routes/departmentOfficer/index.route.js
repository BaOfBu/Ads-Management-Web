import express from "express";
const router = express.Router();

import districtRoutes from "./district.route.js";
import wardRoutes from "./ward.route.js";
import providedInforRoutes from "./provided_infor.route.js";
import adsLocationRoutes from "./ads_location.route.js";
import adsPanelRoutes from "./ads_panel.route.js";
import managementOfficerRoutes from "./management_officer.route.js";
import adsPanelModificationRoutes from "./ads_panel_modification_request.route.js";
import adsLocationModificationRoutes from "./ads_location_modification_request.route.js";
import licenseRequestRoutes from "./license_request.route.js";
import citizenReportRoutes from "./citizen_report.route.js";
import updateProfileRoutes from "./profile.route.js";

function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "departmentOfficer/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.use("/", districtRoutes);
router.use("/district", districtRoutes);
router.use("/ward", wardRoutes);
router.use("/provided-info", providedInforRoutes);
router.use("/ads-location", adsLocationRoutes);
router.use("/ads-panel", adsPanelRoutes);
router.use("/management-officer", managementOfficerRoutes);
router.use("/ads-panel-modification-request", adsPanelModificationRoutes);
router.use("/ads-location-modification-request", adsLocationModificationRoutes);
router.use("/license-request", licenseRequestRoutes);
router.use("/citizen-report", citizenReportRoutes);

router.use("/management", async function(req, res){
    res.render("departmentOfficer/redirect/management");
});

router.use("/request", async function(req, res){
    res.render("departmentOfficer/redirect/request");
});

router.use("/profile", updateProfileRoutes);
// router.use("/officer", async function(req, res){
//     res.render("departmentOfficer/redirect/officer");
// });

export default router;
