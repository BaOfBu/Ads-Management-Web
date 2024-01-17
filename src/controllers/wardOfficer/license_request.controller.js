import moment from "moment";
import licenseRequest from "../../services/departmentOfficer/license_request.service.js";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";
import adsPanel from "../../services/departmentOfficer/ads_panel.service.js";
import imageService from "../../services/departmentOfficer/image.service.js";
import multer from "multer";
import newLicenseRequest from "../../services/wardOfficer/license_request.service.js";

const index = async function (req, res) {
    const user = req.session.authUser;
    let empty = false;
    const license_request = await licenseRequest.findByWardId(user.wardId);

    if (!license_request || license_request.length === 0) {
        empty = true;
    }

    let license_requestWithIndex = license_request.map((request, index) => ({
        ...request,
        startDate: moment(request.startDate).format("DD/MM/YYYY"),
        endDate: moment(request.endDate).format("DD/MM/YYYY"),
        stt: index + 1
    }));

    const currentDateTime = moment().format("HH:mm:ss DD-MM-YYYY");

    res.render("wardOfficer/license_request", {
        empty: empty,
        license_request: license_requestWithIndex,
        date: currentDateTime
    });
};

const cancelRequest = async function (req, res) {
    const licenseRequestId = req.body.licenseRequestId;
    const updateStatus = await licenseRequest.patch({ licenseRequestId: licenseRequestId, status: "Đã hủy" });
    console.log("updateStatus: ", updateStatus);
    const updateLicensePanel = await adsPanel.patch({ adsPanelId: req.body.adsPanelId, licenseId: null });
    return res.json({ success: true, message: "Đã hủy yêu cầu này thành công!" });
};

const addNewRequest = async function (req, res) {
    const user = req.session.authUser;
    const adsLocations = await adsLocation.findAllByWardId(user.wardId);
    const adsPanelTypes = await adsPanel.findAllByAdsLocationId(adsLocations[0].adsLocationId);
    const lengthImg = await imageService.findAll();
    console.log("adsLocations: ", adsLocations);
    console.log("adsPanelTypes: ", adsPanelTypes);

    res.render("wardOfficer/license_request_add", {
        adsLocations: adsLocations,
        defaultAdsLocation: adsLocations[0],
        adsPanelTypes: adsPanelTypes,
        defaultAdsPanelType: adsPanelTypes[0],
        lengthImg: lengthImg.length + 1
    });
};

const getAdsPanelTypeByLocation = async function (req, res) {
    console.log("Đã vô đây");
    const adsLocationId = req.body.adsLocationId;
    const adsPanelTypes = await adsPanel.findAllByAdsLocationId(adsLocationId);
    console.log("adsLocationId: ", adsLocationId);
    console.log("adsPanelTypes: ", adsPanelTypes);
    return res.json({ success: true, adsPanelTypes: adsPanelTypes });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/static/images/ads-panel");
    },
    filename: async function (req, file, cb) {
        console.log("file: ", file);
        const filename = file.originalname;
        req.body.image = "/static/images/ads-panel/" + filename;
        console.log(filename);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const uploadImage = async function (req, res) {
    console.log("Đã vô upload");

    upload.single("image")(req, res, async function (err) {
        console.log("req upload: ", req.body);
        if (err) {
            console.error("error: ", err);
            return res.status(500).json({ error: "Error during upload." });
        } else {
            console.log("file name: ", req.body.image);
            const imgId = await imageService.findById(req.body.imgId);
            console.log("id: ", imgId);
            if (!imgId) {
                const image = await imageService.add({ imgLink: req.body.image });
                return res.json({ success: true, image: req.body.image });
            } else {
                const image = await imageService.patch({ imgId: req.body.imgId, ImgLink: req.body.image });
                return res.json({ success: true, image: req.body.image });
            }
        }
    });
};

const handleAddNewRequest = async function (req, res) {
    console.log("Before: ", req.body);
    const user = req.session.authUser;
    delete req.body.image;
    delete req.body.adsPanelTypeId;
    req.body.wardId = user.wardId;
    req.body.districtId = user.districtId;
    req.body.emailSender = user.email;
    req.body.status = "Chưa duyệt";
    const request = await newLicenseRequest.add(req.body);
    const adsPanel = await adsPanel.patch({ adsPanelId: req.body.adsPanelId, licenseId: request.licenseRequestId });
    console.log("New request: ", request);
    res.redirect("/ward-officer/license-request");
};

export default { index, cancelRequest, addNewRequest, getAdsPanelTypeByLocation, uploadImage, handleAddNewRequest };
