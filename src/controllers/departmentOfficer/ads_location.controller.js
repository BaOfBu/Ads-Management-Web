import moment from "moment";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";
import multer from "multer";

const index = async function (req, res) {
    const empty = false;
    const ads_locations = await adsLocation.findAll();
    console.log("List ads_locations: ", ads_locations);

    if(!ads_locations || ads_locations.length === 0){
        empty = true;
    }

    const ads_locationsWithIndex = ads_locations.map((ads_location, index) => ({
        ...ads_location,
        stt: index + 1,
        // description: district.description ? district.description.slice(0, 50) + " ..." : "",
    }));

    console.log("List có index: ", ads_locationsWithIndex);

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/management_ads_location/ads_location", {
        empty: empty,
        ads_locations: ads_locationsWithIndex,
        date: currentDateTime
    });
};

const addAdsLocation = async function(req, res){
    const empty = false;
    res.render("departmentOfficer/management_ads_location/add", {
        empty: empty,
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/static/images/ads-location/');
    },
    filename: function (req, file, cb) {
        const filename = req.body.adsLocationId + '.' + file.originalname.split('.').pop();
        req.body.image = '/static/images/ads-location/' + filename;
        console.log(filename);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const uploadImage = async function(req, res) {
    console.log("Đã vô upload");
    
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error("error: ", err);
            return res.status(500).json({ error: 'Error during upload.' });
        } else {
            console.log("file name: ", req.body.image);
            const update = await Profile.updateUserInfo(userID, { image: req.body.image });
            console.log("Đã up ảnh thành công, ", update);
            return res.json({ success: true, image: req.body.image });
        }
    });
}

const handle_deleteAdsLocation = async function (req, res){
    console.log("Body: ", req.body);
    await districtService.del(req.body.adsLocationId);
    res.redirect("departmentOfficer/management_ads_location/ads_location");
}

const viewDetailAdsLocation= async function (req, res){
    const location = await adsLocation.findById(req.query.adsLocationId);
    res.render("departmentOfficer/management_ads_location/view_detail", {
        stt: req.query.stt,
        adsLocation: location
    });
}

export default { index, addAdsLocation, uploadImage, handle_deleteAdsLocation,  viewDetailAdsLocation };
