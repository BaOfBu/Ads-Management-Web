import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import adsController from "../../controllers/wardOfficer/ads.controller.js";
import adsService from "../../services/wardOfficer/ads.service.js";
const router = express.Router();

const uploadAdsLocationRequest = "static/images/ads-location/";
if (!fs.existsSync(uploadAdsLocationRequest)) {
    fs.mkdirSync(uploadAdsLocationRequest, { recursive: true });
}
function getNextFilename(folderPath) {
    const files = fs.readdirSync(folderPath);
    const maxIndex = files.reduce((max, file) => {
        const currentIndex = parseInt(path.basename(file, path.extname(file)), 10);
        return currentIndex > max ? currentIndex : max;
    }, -1);

    return (maxIndex + 1).toString();
}
const storageAdsLocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadAdsLocationRequest);
    },
    filename: function (req, file, cb) {
        const filename = getNextFilename(uploadAdsLocationRequest) + path.extname(file.originalname);
        console.log(filename);
        cb(null, filename);
    }
});

const uploadAdsLocation = multer({ storage: storageAdsLocation });

router.get("/", adsController.index);
router.get("/view-detail", adsController.viewDetails);
router.get("/view-panel-detail", adsController.viewPanelDetails);
router.get("/ads-location-edit", adsController.getEditAdsLocation);
router.get("/ads-panel-edit", adsController.getEditAdsPanel);
router.get("/license-request", adsController.licenseRequest);
router.post("/license-request", adsController.handleAddNewRequest);
// router.post("/cancel-request", adsController.cancelRequest);

router.post("/ads-location-edit", uploadAdsLocation.array("image"),async function(req,res,next){
    //console.log("req.body:", req.body);
    const filePath = req.files[0].path;
    let fileName = "/" + filePath.replace(/\\/g, "/"); 
    const imgId = await adsService.saveImage(fileName);
    const adsLocation = await adsService.findAdsLocationRaw(req.body.txtAdsLocationId);
    const ward = await adsService.findWardByWardId(adsLocation.wardId);
    const entity = {
        AdsLocationId: req.body.txtAdsLocationId,
        AdsLocationTypeId : req.body.LocationType,
        AdsTypeId : req.body.AdsType,
        ImgId : imgId,
        RequestReason : req.body.RequestReason,
        WardId : adsLocation.wardId,
        status:"Chưa duyệt",
        RequestTime: new Date(),
        districtId: ward.districtId,
    }
    const ads_location_edit = await adsService.createAdsLocationEdit(entity);
    //const update = await adsService.updateMerchantInfo(userID, { image: req.body.image });
    //return res.json({ success: true, image: req.body.image });
    return res.redirect("/ward-officer/ads");
});

router.post("/ads-panel-edit", async function(req,res,next){
    console.log("req.body:", req.body);
    const adsLocation = await adsService.findAdsLocationRaw(req.body.txtAdsLocationId);
    const ward = await adsService.findWardByWardId(adsLocation.wardId);
    const entity = {
        AdsPanelId: req.body.txtAdsPanelId,
        AdsLocationId: req.body.txtAdsLocationId,
        AdsPanelTypeId : req.body.adsPanelType,
        RequestReason : req.body.RequestReason,
        WardId : adsLocation.wardId,
        status:"Chưa duyệt",
        RequestTime: new Date(),
        districtId: ward.districtId,
        Height: req.body.Height,
        Width: req.body.Width,
        Quantity: req.body.Quantity,

    }
    const ads_location_edit = await adsService.createAdsPanelEdit(entity);
    //const update = await adsService.updateMerchantInfo(userID, { image: req.body.image });
    //return res.json({ success: true, image: req.body.image });
    return res.redirect("/ward-officer/ads");
});
export default router;
