import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import SaveReportService from "../../services/departmentOfficer/save-report.service.js";
import SaveImageService from "../../services/departmentOfficer/save-image.service.js";
const router = express.Router();
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

// Function to get the next available filename in the upload directory
function getNextFilename() {
    const files = fs.readdirSync(uploadDirectory);
    const maxIndex = files.reduce((max, file) => {
        const currentIndex = parseInt(path.basename(file, path.extname(file)), 10);
        return currentIndex > max ? currentIndex : max;
    }, -1);

    return (maxIndex + 1).toString();
}

// Set up multer to store uploaded files in the 'static/images/upload' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const newFilename = getNextFilename() + path.extname(file.originalname);
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", upload.array("images", 2), async function (req, res) {
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

export default router;
