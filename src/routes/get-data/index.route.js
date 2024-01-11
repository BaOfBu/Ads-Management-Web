import express from "express";
import GetAdsLocationController from "../../controllers/departmentOfficer/get-ads-location.controller.js";
import getTheAdsRoute from "../get-data/get-the-ads.route.js";
import getReportRoutes from "../get-data/get-report.route.js";
const router = express.Router();
router.use("/get-ads-location", getTheAdsRoute);
router.use("/get-report-location", getReportRoutes);
export default router;
