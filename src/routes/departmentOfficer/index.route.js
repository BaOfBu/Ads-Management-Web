import express from "express";
const router = express.Router();

import homeRoutes from "./home.route.js";
import wardRoutes from "./ward.route.js";
import providedInforRoutes from "./provided_infor.route.js";

// Middleware to apply default settings to the response locals
function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "departmentOfficer/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.use("/", homeRoutes);
router.use("/ward", wardRoutes);
router.use("/provided-infor", providedInforRoutes);

export default router;
