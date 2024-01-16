import moment from "moment";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";
import multer from "multer";
import imageService from "../../services/departmentOfficer/image.service.js";
import getWardService from "../../services/departmentOfficer/get-ward.service.js";
import getDistrictService from "../../services/departmentOfficer/get-district.service.js";
import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";

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
        date: currentDateTime,
    });
};

const addAdsLocation = async function(req, res){
    const typeLocation = await providedInfo.findAll('location_type');
    const typeAdsPanel = await providedInfo.findAll('ads_type');

    const image = await imageService.findAll();
    console.log("typeLocation: ", typeLocation);
    console.log("typeAdsPanel: ", typeAdsPanel);
    res.render("departmentOfficer/management_ads_location/add", {
        typeLocation: typeLocation,
        typeAdsPanel: typeAdsPanel,
        lengthImg: image.length + 1
    });
}

// async function getTheLocation(lng, lat) {
//     const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&language=vi`;
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     const features = data.features;
//     console.log("features: ", features);
//     return features[0].place_name;
// }

async function getWardId(features, districtId) {
//     const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     const features = data.features;
//     console.log(features[0].context);
    for (const context of features[0].context) {
        if (context.text.includes("Phường")) {
            const numericPart = context.text.replace(/\D/g, "");
            console.log("ward: ", numericPart);
            return await getWardService.findByWardName(numericPart, districtId);
        }
    }
//     // console.log(features[0].context[0].text);
    return await getWardService.findByWardName(features[0].context[0].text, districtId);
}

async function getDistrictId(features) {
    // const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
    // const response = await fetch(apiUrl);
    // const data = await response.json();
    // const features = data.features;
    for (const context of features[0].context) {
        if (context.text.includes("Quận")) {
            const index = context.text.indexOf("Quận");
            const contentAfterQuan = index !== -1 ? context.text.slice(index + 4).trim() : context.text.trim();
            return getDistrictService.findByDistrictName(contentAfterQuan);
        }
    }
    return getDistrictService.findByDistrictName(features[0].context[2].replace(/\D/g, ""));
}

const getAddress = async function(req, res){
    const accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";
    const lat = req.body.lat;
    const lng = req.body.long;

    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&language=vi`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const features = data.features;

    const location = features[0].place_name;
    let districtId = await getDistrictId(features);

    let wardId = await getWardId(features, districtId);
    // for (const context of features[0].context) {
    //     if (context.text.includes("Phường")) {
    //         const numericPart = context.text.replace(/\D/g, "");
    //         console.log("ward: ", numericPart);
    //         wardId = await getWardService.findByWardName(numericPart, districtId);
    //     }
    //     if (context.text.includes("Quận")) {
    //         const index = context.text.indexOf("Quận");
    //         const contentAfterQuan = index !== -1 ? context.text.slice(index + 4).trim() : context.text.trim();
    //         districtId = getDistrictService.findByDistrictName(contentAfterQuan);
    //     }
    // }

    // if(wardId === null) wardId = await getWardService.findByWardName(features[0].context[0].text, districtId);
    // if(districtId === null) districtId = getDistrictService.findByDistrictName(features[0].context[2].replace(/\D/g, ""));

    return res.json({location: location, districtId: districtId, wardId: wardId});
}

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, process.cwd() + '/static/images/ads-location/');
//     },
//     filename: function (req, file, cb) {
//         const filename = req.body.adsLocationId + '.' + file.originalname.split('.').pop();
//         req.body.image = '/static/images/ads-location/' + filename;
//         console.log(filename);
//         cb(null, filename);
//     }
// });

// const upload = multer({ storage: storage });

// const uploadImage = async function(req, res) {
//     console.log("Đã vô upload");
    
//     upload.single('image')(req, res, async function (err) {
//         if (err) {
//             console.error("error: ", err);
//             return res.status(500).json({ error: 'Error during upload.' });
//         } else {
//             console.log("file name: ", req.body.image);
//             const update = await Profile.updateUserInfo(userID, { image: req.body.image });
//             console.log("Đã up ảnh thành công, ", update);
//             return res.json({ success: true, image: req.body.image });
//         }
//     });
// }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/static/images/ads-location');
    },
    filename: async function (req, file, cb) {
        console.log("file: ", file);
        const filename = file.originalname;
        req.body.image = "/static/images/ads-location/" + filename;
        console.log(filename);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const uploadImage = async function(req, res) {
    console.log("Đã vô upload");
    
    upload.single('image')(req, res, async function (err) {
        console.log("req upload: ", req.body);
        if (err) {
            console.error("error: ", err);
            return res.status(500).json({ error: 'Error during upload.' });
        } else {
            console.log("file name: ", req.body.image);
            const imgId = await imageService.findById(req.body.imgId);
            console.log("id: ", imgId);
            if(!imgId){
                console.log("Chưa có");
                const image = await imageService.add({imgLink: req.body.image});
                return res.json({ success: true, image: req.body.image });
            }else{
                const image = await imageService.patch(imgId);
                return res.json({ success: true, image: req.body.image });   
            }
            
        }
    });
}

const handle_addAdsLocation = async function(req, res){
    console.log("body: ", req.body);
    const coordinate = req.body.coordinate;
    const split = coordinate.split(", ");
    delete req.body.coordinate;
    delete req.body.image;
    req.body.lat = split[0];
    req.body.long = split[1];
    req.body.status = 'Chưa quy hoạch';
    const adsLocationId = await adsLocation.add(req.body);
    res.redirect("/department-officer/ads-location");
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

export default { index, addAdsLocation, getAddress, uploadImage, handle_deleteAdsLocation,  viewDetailAdsLocation, handle_addAdsLocation };
