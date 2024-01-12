import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = express.Router();
// Ensure the upload directory exists
const uploadDirectory = "static/images/citizenReport/";
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
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

router.post("/", upload.array("images", 2), (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    const content = req.body.content;
    const status = "Chưa xử lý";
    const long = req.body.long;
    const lat = req.body.lat;
    const reportTypeId = req.body.reportTypeId;
    const sendDate = req.body.sendDate;
    const adsPanelId = req.body.adsPanelId;
    const uploadedFiles = req.files || [];
    uploadedFiles.forEach(file => {
        const filePath = file.path;
    });
    res.json({ status: "success" });
});

export default router;
