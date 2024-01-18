import express from "express";
import homeRoutes from "./home.route.js";
import adsRoutes from "./ads.route.js";
import licenseRequestRoutes from "./license_request.route.js";
import reportRoutes from "./report.route.js";
import adsPanelRoutes from "./adspanel.route.js";
import updateProfileRoutes from "./profile.route.js";

const router = express.Router();

// Middleware to apply default settings to the response locals
function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "wardOfficer/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.use("/",homeRoutes);
router.use("/ads",adsRoutes);
router.use("/license-request", licenseRequestRoutes);
router.use("/report",reportRoutes);
router.use("/ads-panel",adsPanelRoutes);
router.use("/profile", updateProfileRoutes);

export default router;
