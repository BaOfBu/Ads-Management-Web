import express from "express";
import adsLocationController from "../../controllers/departmentOfficer/ads_location.controller.js";

const router = express.Router();

router.get("/", adsLocationController.index);
router.get("/add", adsLocationController.addAdsLocation);
router.post("/del", adsLocationController.handle_deleteAdsLocation);
router.get("/view-detail", adsLocationController.viewDetailAdsLocation);
router.post("/get-address", adsLocationController.getAddress);
router.post("/upload-image", adsLocationController.uploadImage);
router.post("/add", adsLocationController.handle_addAdsLocation);

export default router;
