import express from "express";
import licenseRequestController from "../../controllers/districtOfficer/license_request.controller.js";

const router = express.Router();

router.get("/", licenseRequestController.index);
router.post("/cancel-request", licenseRequestController.cancelRequest);
router.get("/add", licenseRequestController.addNewRequest);
router.post("/get-ads-panel-type", licenseRequestController.getAdsPanelTypeByLocation);
router.post("/upload-image", licenseRequestController.uploadImage);
router.post("/add", licenseRequestController.handleAddNewRequest);

export default router;
