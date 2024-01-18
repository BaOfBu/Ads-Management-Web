import moment from "moment";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";
import multer from "multer";
import imageService from "../../services/departmentOfficer/image.service.js";
import getWardService from "../../services/departmentOfficer/get-ward.service.js";
import getDistrictService from "../../services/departmentOfficer/get-district.service.js";
import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";
import district from "../../services/departmentOfficer/district.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";

function generatePagination(ads_locations, districtId, wardId, pageCurrent){
    const limit = 8;
    const page = pageCurrent;
    const offset = (page - 1) * limit;

    const total = ads_locations.length;
    const nPages = Math.ceil(total / limit);

    let pageNumbers = [];
    if(nPages <= 7){
        for (let i = 1; i <= nPages; i++) {
            pageNumbers.push({
                value: i,
                isActive: i === +page,
                districtId: districtId,
                wardId: wardId
            });
        }
    }else{
        if(Number(page) + 2 <= nPages){
            if(Number(page) > 5){
                for (let i = 1; i <= 2; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                        wardId: wardId
                    });
                }
                pageNumbers.push({
                    value: '..',
                    isActive: false,
                    districtId: districtId,
                    wardId: wardId
                });
                for (let i = Number(page) - 2; i <= Number(page) + 2; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                        wardId: wardId
                    });
                }  
            }else if(Number(page) > 3){
                for (let i = Number(page) - 3; i <= Number(page) + 3; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                        wardId: wardId
                    });
                }    
            }else{
                for (let i = 1; i <= 7; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                        wardId: wardId
                    });
                } 
            }
        }else if(Number(page) + 2 > nPages){
            for (let i = 1; i <= 2; i++) {
                pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    districtId: districtId,
                    wardId: wardId
                });
            }
            pageNumbers.push({
                value: '..',
                isActive: false,
                districtId: districtId,
                wardId: wardId
            });
            for (let i = nPages - 4; i <= nPages; i++) {
                pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    districtId: districtId,
                    wardId: wardId
                });
            }
        }    
    }

    let list = ads_locations;
    if(total > offset){
        list = ads_locations.slice(offset, offset+limit); 
    }

    let isFirstPage = false;
    if(Number(page) === 1) isFirstPage = true;

    let isLastPage = false;
    if(Number(page) === nPages || nPages === 0) isLastPage = true;

    const pagination = {
        list: list,
        pageNumbers: pageNumbers,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage
    };

    return pagination;
}

const index = async function (req, res) {
    let empty = false;

    const districts = await district.findAll();
    const districtCurrent = req.query.districtId || -1;
    const wardCurrent = req.query.wardId || -1;
    const page = req.query.page || 1;
    const ads_locations = await getListByWard(wardCurrent, districtCurrent);
    const wards = await ward.findAllByDistrictId(districtCurrent);
    let districtName = "Tất cả quận";
    let wardName = "Tất cả phường";

    if (districtCurrent !== -1 && districtCurrent !== "-1"){
        const tmpDistrict = await providedInfo.findById('district', 'districtId', districtCurrent);
        districtName = "Quận " + tmpDistrict.name;
    } 
    if (wardCurrent !== -1 && wardCurrent !== "-1"){
        const tmpWard = await providedInfo.findById('ward', 'wardId', wardCurrent);
        wardName = "Phường " + tmpWard.name;
    } 

    if(!ads_locations || ads_locations.length === 0){
        empty = true;
    }

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    const pagination = generatePagination(ads_locations, districtCurrent, wardCurrent, page);

    res.render("departmentOfficer/management_ads_location/ads_location", {
        empty: empty,
        ads_locations: pagination.list,
        date: currentDateTime,
        districts: districts,
        wards: wards,
        isFirstPage: pagination.isFirstPage,
        isLastPage: pagination.isLastPage,
        pageNumbers: pagination.pageNumbers,
        page: page,
        districtId: districtCurrent,
        wardId: wardCurrent,
        districtName: districtName,
        wardName: wardName
    });
};

const getWardByDistrict = async function(req, res){
    const wards = await ward.findAllByDistrictId(req.body.districtId);
    console.log("wards: ", wards);
    return res.json({success: true, wards: wards});
}

async function getListByWard(wardId, districtId){
    let ads_locations;
    console.log("districtId: ", districtId);
    console.log("wardId: ", wardId);
    if(wardId === -1 || wardId === "-1"){
        if(districtId === -1 || districtId === "-1"){
            console.log("Đã vô đây");
            ads_locations = await adsLocation.findAll();   
        }else{
            ads_locations = await adsLocation.findAllByDistrict(districtId);
        }  
    }else{
        ads_locations = await adsLocation.findAllByWard(wardId);
    }

    let ads_location = ads_locations.map((location, index) => ({
        ...location,
        stt: index + 1,
    }));

    return ads_location;
}

const addAdsLocation = async function(req, res){
    const typeLocation = await providedInfo.findAll('location_type');
    const typeAdsPanel = await providedInfo.findAll('ads_type');

    const image = await imageService.findAll();
    console.log("typeLocation: ", typeLocation);
    console.log("typeAdsPanel: ", typeAdsPanel);
    console.log("image: ", image);
    console.log("last imgId: ", image[image.length - 1]);
    res.render("departmentOfficer/management_ads_location/add", {
        typeLocation: typeLocation,
        typeAdsPanel: typeAdsPanel,
        lengthImg: (image.length > 0)? image[image.length - 1].imgId + 1 : 1
    });
}

async function getWardId(features, districtId) {
    for (const context of features[0].context) {
        if (context.text.includes("Phường")) {
            const index = context.text.indexOf("Phường");
            const contentAfterPhuong = index !== -1 ? context.text.slice(index + 6).trim() : context.text.trim();
            console.log("ward: ", contentAfterPhuong);
            return await getWardService.findByWardName(contentAfterPhuong, districtId);
        }
    }
    return await getWardService.findByWardName(features[0].context[0].text, districtId);
}

async function getDistrictId(features) {
    for (const context of features[0].context) {
        if (context.text.includes("Quận")) {
            const index = context.text.indexOf("Quận");
            const contentAfterQuan = index !== -1 ? context.text.slice(index + 4).trim() : context.text.trim();
            return getDistrictService.findByDistrictName(contentAfterQuan);
        }
    }
    return getDistrictService.findByDistrictName(features[0].context[2].text);
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

    return res.json({location: location, districtId: districtId, wardId: wardId});
}

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
    res.redirect("/department-officer/ads-location?districtId=-1&wardId=-1&page=1");
}

const editAdsLocation = async function(req, res){
    const ads_locations = await adsLocation.findById(req.query.adsLocationId);

    const typeLocation = await providedInfo.findAll('location_type');
    const typeAdsPanel = await providedInfo.findAll('ads_type');

    console.log("typeLocation: ", typeLocation);
    console.log("typeAdsPanel: ", typeAdsPanel);
    res.render("departmentOfficer/management_ads_location/edit", {
        adsLocation: ads_locations,
        typeLocation: typeLocation,
        typeAdsPanel: typeAdsPanel,
        stt: req.query.stt
    });
}

const handle_editAdsLocation = async function(req, res){
    const ads_location = await adsLocation.findByName(req.body.location);
    if(ads_location === undefined || ads_location.adsLocationId.toString() === req.body.adsLocationId){
        const coordinate = req.body.coordinate;
        const split = coordinate.split(", ");
        delete req.body.coordinate;
        delete req.body.image;
        req.body.lat = split[0];
        req.body.long = split[1];
        const update = await adsLocation.patch(req.body);
    }
    
}

const handle_deleteAdsLocation = async function (req, res){
    console.log("Body: ", req.body);
    const imgId = req.body.imgId;
    await adsLocation.del(req.body.adsLocationId);
    await imageService.del(imgId);
    res.redirect("/department-officer/ads-location?districtId=-1&wardId=-1&page=1");
}

const viewDetailAdsLocation= async function (req, res){
    const location = await adsLocation.findById(req.query.adsLocationId);
    res.render("departmentOfficer/management_ads_location/view_detail", {
        stt: req.query.stt,
        adsLocation: location
    });
}

const isAvailable = async function(req, res){
    const location = req.body.location;
    console.log("Cần kt: ", location);
    const ads_location = await adsLocation.findByName(location);
    console.log("Kết quả tìm kiếm: ", ads_location);
    if(ads_location === undefined){
        console.log("undefined");
    }
    return res.json({success: true, ads_location: ads_location});
}

export default { index, addAdsLocation, getWardByDistrict, getAddress, uploadImage, editAdsLocation, handle_editAdsLocation, handle_deleteAdsLocation,  viewDetailAdsLocation, handle_addAdsLocation, isAvailable };
