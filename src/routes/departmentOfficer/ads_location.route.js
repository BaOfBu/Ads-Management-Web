import express from "express";
import adsLocationController from "../../controllers/departmentOfficer/ads_location.controller.js";

const router = express.Router();
const setActiveNavItem = (req, res, next) => {
    res.locals.activeNavItem = "management";
    next();
};
router.use(setActiveNavItem);
router.get("/", adsLocationController.index);
router.get("/add", adsLocationController.addAdsLocation);
router.post("/del", adsLocationController.handle_deleteAdsLocation);
router.get("/view-detail", adsLocationController.viewDetailAdsLocation);
router.post("/get-address", adsLocationController.getAddress);
router.post("/upload-image", adsLocationController.uploadImage);
router.post("/add", adsLocationController.handle_addAdsLocation);
router.post("/get-ward-by-district", adsLocationController.getWardByDistrict);
// router.post("/get-list-by-ward", adsLocationController.getListByWard);
router.get("/edit", adsLocationController.editAdsLocation);
router.post("/patch", adsLocationController.handle_editAdsLocation);
router.post("/is-available", adsLocationController.isAvailable);

export default router;
