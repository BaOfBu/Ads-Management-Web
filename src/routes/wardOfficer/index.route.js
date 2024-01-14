import express from "express";
import homeRoutes from "./home.route.js";
import adsRoutes from "./ads.route.js";
const router = express.Router();

// Middleware to apply default settings to the response locals
function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "wardOfficer/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.use("/",homeRoutes);
router.use("/ads",adsRoutes);

export default router;
