import adsService from "../../services/wardOfficer/ads.service.js";
import moment from "moment";
import imageService from "../../services/departmentOfficer/image.service.js";
import newLicenseRequest from "../../services/wardOfficer/license_request.service.js";

const statusName = ["Đã quy hoạch","Chưa quy hoạch"];

const index = async function (req, res) {
    const user = req.session.authUser;
    //console.log("user",user);
    const wardName = await adsService.findWardByWardId(user.wardId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayAdsLocation = await adsService.findAllAdsLocationByWardId(user.wardId);
    // console.log("wardName",wardName);
    // console.log("districtName",districtName);
    //console.log("arrayAdsLocation",arrayAdsLocation);
    const adsLocationWithIndex = arrayAdsLocation.map((adsLocation, index) => ({
        ...adsLocation,
        stt: index + 1
    }));
    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY')
    res.render("wardOfficer/ads_location", {
        wardName: wardName.name,
        districtName: districtName.name,
        arrayAdsLocation: adsLocationWithIndex,
        date: currentDateTime
    });
}

const viewDetails = async function (req, res) {
    const ads_panel = await adsService.findAllAdsPanelByAdsLocationId(req.query.adsLocationId);
    const adsLocationName = await adsService.findAdsLocationName(req.query.adsLocationId);
    //console.log("ads_panel",ads_panel);
    //console.log("adsLocationName",adsLocationName);
    const adsPanelWithIndex = ads_panel.map((adsPanel, index) => ({
        ...adsPanel,
        stt: index + 1
    }));
    res.render("wardOfficer/ads_panel", {
        adsLocationName: adsLocationName.location,
        adsPanel: adsPanelWithIndex
    })
};

const viewPanelDetails = async function (req, res) {
    const ads_panel = await adsService.findAdsPanel(req.query.adsPanelId);
    //console.log("ads_panel",ads_panel);
    res.render("wardOfficer/ads_panel_detail", {
        adsPanel: ads_panel
    })
}

const getEditAdsLocation = async function (req, res) {
    const adsLocation = await adsService.findAdsLocation(req.query.adsLocationId);
    console.log("adsLocation",adsLocation);
    const LocationType = await adsService.findAllLocationTypeName();
    const adsType = await adsService.findAllAdsTypeName();
    //console.log("adsLocation",adsLocation);

    res.render("wardOfficer/edit_ads_location", {
        status: statusName,
        adsLocation: adsLocation,
        locationType: LocationType,
        adsType: adsType
    })
}
const getEditAdsPanel = async function (req, res) {
    const adsPanelType = await adsService.findAllAdsPanelType();
    const adsPanel = await adsService.findAdsPanel(req.query.adsPanelId);
    console.log("adsPanel",adsPanel);
    console.log("adsPanelType",adsPanelType);
    res.render("wardOfficer/edit_ads_panel", {
        adsPanelType : adsPanelType,
        adsPanel : adsPanel
    })
}

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, process.cwd() + '/static/images/user/account/');
//     },
//     filename: function (req, file, cb) {
//         const userID = req.session.authUser._id;
//         const filename = userID + '.' + file.originalname.split('.').pop();
//         req.body.image = "/static/images/ads-location/" + filename;
//         console.log(filename);
//         cb(null, filename);
//     }
// });

// const upload = multer({ storage: storage });

// const uploadAvatar = async function(req, res) {
//     console.log("Đã vô upload roi ne");
//     const userID = req.session.authUser._id;
//     console.log("userID: ", userID);
//     upload.single('image')(req, res, async function (err) {
//         if (err) {
//             console.error("error: ", err);
//             return res.status(500).json({ error: 'Error during upload.' });
//         } else {
//             console.log("file name: ", req.body.image);
//             const update = await Profile.updateMerchantInfo(userID, { image: req.body.image });
//             console.log("Đã up ảnh thành công, ", update);
//             //return res.json({ success: true, image: req.body.image });
//             req.session.authUser.image = req.body.image;
//             return res.redirect("/merchant/home");
//         }
//     });
// }

const licenseRequest = async function(req, res){
    const adsPanelId = req.query.adsPanelId;
    let available = true;

    let adsPanel = await adsService.findLicenseRequestOfAdsPanel(adsPanelId);

    console.log("adsPanel: ", adsPanel);

    if(adsPanel.status === 'Chưa duyệt' || adsPanel.status === 'Đã duyệt'){
        adsPanel.startDate = moment(adsPanel.startDate).format('DD/MM/YYYY');
        adsPanel.endDate = moment(adsPanel.endDate).format('DD/MM/YYYY');
        res.render("wardOfficer/license_request_AdsPanelScreen", {
            adsPanel: adsPanel,
            available: available,
        });
    }else{
        available = false;
        const lengthImg = await imageService.findAll();

        res.render("wardOfficer/license_request_AdsPanelScreen", {
            adsPanel: adsPanel,
            available: available,
            lengthImg: lengthImg.length + 1
        });
    }
}

const handleAddNewRequest = async function(req, res){
    console.log("Before: ", req.body);
    const user = req.session.authUser;
    delete req.body.image;
    delete req.body.adsPanelTypeId;
    req.body.wardId = user.wardId;
    req.body.districtId = user.districtId;
    req.body.status = "Chưa duyệt";
    const request = await newLicenseRequest.add(req.body);
    console.log("New request: ", request);
    res.redirect(`/ward-officer/ads/license-request?adsPanelId=${req.body.adsPanelId}`);
}

export default { index, viewDetails, viewPanelDetails, getEditAdsLocation, getEditAdsPanel, licenseRequest, handleAddNewRequest};