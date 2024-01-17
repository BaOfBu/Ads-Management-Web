import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import SaveReportService from "../../services/departmentOfficer/save-report.service.js";
import SaveImageService from "../../services/departmentOfficer/save-image.service.js";
import getWardService from "../../services/departmentOfficer/get-ward.service.js";
import getDistrictService from "../../services/departmentOfficer/get-district.service.js";
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ensure the upload directory exists
const uploadDirectory = "static/images/citizenReport/";
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}
const accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";

async function getTheLocation(lng, lat) {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const features = data.features;
    return features[0].place_name;
}

async function getWardId(lng, lat, districtId) {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const features = data.features;
    for (const context of features[0].context) {
        if (context.text.includes("Phường")) {
            const index = context.text.indexOf("Phường");
            const contentAfterQuan = index !== -1 ? context.text.slice(index + 6).trim() : context.text.trim();
            return await getWardService.findByWardName(contentAfterQuan, districtId);
        }
    }
    return await getWardService.findByWardName(features[0].context[0].text, districtId);
}

async function getDistrictId(lng, lat) {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const features = data.features;
    for (const context of features[0].context) {
        console.log(context.text);
        if (context.text.includes("Quận")) {
            const index = context.text.indexOf("Quận");
            const contentAfterQuan = index !== -1 ? context.text.slice(index + 4).trim() : context.text.trim();
            return getDistrictService.findByDistrictName(contentAfterQuan);
        }
    }
    return getDistrictService.findByDistrictName(features[0].context[2].text);
}

let currentIndex = -1;
function getMaxIndex() {
    const files = fs.readdirSync(uploadDirectory);
    const indices = files.map(file => parseInt(path.basename(file, path.extname(file)), 10));
    return Math.max(...indices, 0);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: async function (req, file, cb) {
        fs.readdir(uploadDirectory, (err, files) => {
            if (err) {
                return cb(err);
            }
            const indices = files.map(existingFile => parseInt(path.basename(existingFile, path.extname(existingFile)), 10));
            currentIndex = getMaxIndex() + 1;
            const nextIndex = Math.max(...indices, 0) + 1;
            const newFilename = currentIndex + path.extname(file.originalname);
            cb(null, newFilename);
        });
    }
});

const upload = multer({ storage: storage });

router.post("/", upload.array("images", 2), async function (req, res) {
    currentIndex = getMaxIndex();
    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    const content = req.body.content;
    const long = req.body.long;
    const lat = req.body.lat;
    const reportTypeId = req.body.reportTypeId;
    const sendDate = req.body.sendDate;
    const adsPanelId = req.body.adsPanelId;
    const uploadedFiles = req.files || [];
    const location = await getTheLocation(long, lat);
    const districtId = await getDistrictId(long, lat);
    const wardId = await getWardId(long, lat, Number(districtId));
    console.log(wardId);
    let imgIds = [];
    for (const file of uploadedFiles) {
        const filePath = file.path;
        let fileModify = "/" + filePath.replace(/\\/g, "/");
        const imgId = await SaveImageService.saveImage(fileModify);
        imgIds.push(imgId);
    }
    while (imgIds.length < 2) {
        imgIds.push(null);
    }
    if (adsPanelId != "") {
        await SaveReportService.saveReportFromAdsPoint({
            email: email,
            name: name,
            location: location,
            content: content,
            phone: phone,
            sendDate: sendDate,
            wardId: wardId,
            districtId: districtId,
            long: long,
            lat: lat,
            reportTypeId: reportTypeId,
            imgId1: imgIds[0],
            imgId2: imgIds[1],
            adsPanelId: adsPanelId
        });
    } else {
        await SaveReportService.saveReportFromEmptyPoint({
            email: email,
            name: name,
            location: location,
            wardId: wardId,
            districtId: districtId,
            content: content,
            phone: phone,
            sendDate: sendDate,
            long: long,
            lat: lat,
            reportTypeId: reportTypeId,
            imgId1: imgIds[0],
            imgId2: imgIds[1]
        });
    }
    res.json({ status: "success" });
});
router.get("/check-ads-panel-report", async function (req, res) {
    if ((await SaveReportService.checkReportAdsPanel(req.query.adsPanelId)) == true) {
        res.json(false);
    } else res.json(true);
});

export default router;
