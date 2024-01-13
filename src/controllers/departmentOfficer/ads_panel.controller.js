import moment from "moment";
import adsPanel from "../../services/departmentOfficer/ads_panel.service.js";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";
import adsPanelType from "../../services/departmentOfficer/provided_infor.service.js";
import imageService from "../../services/departmentOfficer/image.service.js";
import multer from "multer";

const index = async function (req, res) {
    let empty = false;
    const ads_panels = await adsPanel.findAll();

    console.log("List ads_panels: ", ads_panels);

    if(!ads_panels || ads_panels.length === 0){
        empty = true;
    }

    const ads_panelsWithIndex = ads_panels.map((ads_panel, index) => ({
        ...ads_panel,
        stt: index + 1,
    }));

    // console.log("List có index: ", ads_panelsWithIndex);

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/management_ads_panel/ads_panel", {
        empty: empty,
        ads_panels: ads_panelsWithIndex,
        date: currentDateTime
    });
};

const viewDetailAdsPanel= async function (req, res){
    let location = await adsPanel.findById(req.query.adsPanelId);
    location.startDate = moment(location.startDate).format('DD/MM/YYYY');
    location.endDate = moment(location.endDate).format('DD/MM/YYYY');

    res.render("departmentOfficer/management_ads_panel/view_detail", {
        stt: req.query.stt,
        adsPanel: location
    });
}

const addAdsPanel = async function (req, res){
    const adsLocations = await adsLocation.findAll();
    const adsPanelTypes = await adsPanelType.findAll('ads_panel_type');
    // const image = await imageService.findAll();

    // console.log("length: ", image.length);
    res.render("departmentOfficer/management_ads_panel/add", {
        adsLocations: adsLocations,
        defaultAdsLocation: adsLocations[0].location,
        adsPanelTypes: adsPanelTypes,
        defaultAdsPanelType: adsPanelTypes[0].name,
        // lengthImg: image.length + 1
    });
}

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, process.cwd() + '/static/images/ads-panel');
//     },
//     filename: async function (req, file, cb) {
//         console.log("file: ", file);
//         const filename = file.originalname;
//         req.body.image = "/static/images/ads-panel/" + filename;
//         console.log(filename);
//         cb(null, filename);
//     }
// });

// const upload = multer({ storage: storage });

// const uploadImage = async function(req, res) {
//     console.log("Đã vô upload");
    
//     upload.single('image')(req, res, async function (err) {
//         console.log("req upload: ", req.body);
//         if (err) {
//             console.error("error: ", err);
//             return res.status(500).json({ error: 'Error during upload.' });
//         } else {
//             console.log("file name: ", req.body.image);
//             const imgId = await imageService.findById(req.body.imgId);
//             console.log("id: ", imgId);
//             if(!imgId){
//                 const image = await imageService.add({imgLink: req.body.image});
//                 return res.json({ success: true, image: req.body.image });
//             }else{
//                 const image = await imageService.patch(imgId);
//                 return res.json({ success: true, image: req.body.image });   
//             }
            
//         }
//     });
// }

const handle_addAdsPanel = async function(req, res){
    // let splitStart = req.body.startDate.split('/');
    // req.body.startDate = splitStart[2] + '-' + splitStart[1] + '-' + splitStart[0] + ' 00:00:00';
    
    // let splitEnd = req.body.endDate.split('/');
    // req.body.endDate = splitEnd[2] + '-' + splitEnd[1] + '-' + splitEnd[0] + ' 00:00:00';
    delete req.body.image;
    const ads_panel = await adsPanel.add(req.body);
    res.redirect("/department-officer/ads-panel");
}

const editAdsPanel = async function(req, res){
    const adsLocations = await adsLocation.findAll();
    const adsPanelTypes = await adsPanelType.findAll('ads_panel_type');

    const adsPanelCurrent = await adsPanel.findById(req.query.adsPanelId);
    console.log("current: ", adsPanelCurrent);
    res.render("departmentOfficer/management_ads_panel/edit", {
        stt: req.query.stt,
        adsLocations: adsLocations,
        adsPanelCurrent: adsPanelCurrent,
        // defaultAdsLocation: adsPanelCurrent.ads_location_name,
        adsPanelTypes: adsPanelTypes,
        // defaultAdsPanelType: adsPanelCurrent.ads_panel_type_name,
    });
}

const handle_deleteAdsPanel = async function (req, res){
    console.log("Body: ", req.body);
    // const imgId = req.body.imgId;
    await adsPanel.del(req.body.adsPanelId);
    // await imageService.del(imgId);
    res.redirect("/department-officer/ads-panel");
}

const handle_editAdsPanel = async function (req, res){
    // delete req.body.image;
    // delete req.body.imgId;
    await adsPanel.patch(req.body);
    res.redirect("/department-officer/ads-panel");
}
export default { index, viewDetailAdsPanel, addAdsPanel, handle_addAdsPanel, editAdsPanel, handle_deleteAdsPanel, handle_editAdsPanel };
