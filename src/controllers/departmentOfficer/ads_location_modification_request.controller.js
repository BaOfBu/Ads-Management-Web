import moment from "moment";
import adsLocationModificationRequest from "../../services/departmentOfficer/ads_location_modification_request.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";
import district from "../../services/departmentOfficer/district.service.js";
import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";
import imageService from "../../services/departmentOfficer/image.service.js";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";

const index = async function (req, res) {
    let empty = false;

    const edit_ads_locations_request = await adsLocationModificationRequest.findAll();
    const districts = await district.findAll();
    if(!edit_ads_locations_request || edit_ads_locations_request.length === 0){
        empty = true;
    }

    let edit_ads_locations_requestWithIndex = edit_ads_locations_request.map((request, index) => ({
        ...request,
        requestTime: moment(request.requestTime).format('DD/MM/YYYY HH:mm:ss'),
        stt: index + 1,
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/ads_location_modification_request/list", {
        empty: empty,
        edit_ads_locations_request: edit_ads_locations_requestWithIndex,
        districts: districts,
        date: currentDateTime
    });
};

const getWardByDistrict = async function(req, res){
    const wards = await ward.findAllByDistrictId(req.body.districtId);
    console.log("wards: ", wards);
    return res.json({success: true, wards: wards});
}

const getRequestByWard = async function(req, res){
    const requests = await adsLocationModificationRequest.findByWardId(req.body.wardId);

    let request = requests.map((request, index) => ({
        ...request,
        requestTime: moment(request.requestTime).format('DD/MM/YYYY HH:mm:ss'),
        stt: index + 1,
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');
    console.log("request: ", request);
    return res.json({success: true, request: request, date: currentDateTime});   
}

const cancelRequest = async function(req, res){
    const requestId = req.body.requestId;
    const updateStatus = await adsLocationModificationRequest.patch({requestId: requestId, status: "Đã hủy"});
    console.log("updateStatus: ", updateStatus);
    return res.json({success: true, message: "Đã hủy yêu cầu này thành công!"});
}

const acceptRequest = async function(req, res){
    const requestId = req.body.requestId;
    const adsLocationId = req.body.adsLocationId;
    const adsLocationNew = req.body.adsLocationNew;

    console.log("adsLocationNew", adsLocationNew);

    const adsLocationTypeId = await providedInfo.findByName('location_type', adsLocationNew.ads_location_type);
    const adsTypeId = await providedInfo.findByName('ads_type', adsLocationNew.ads_type);
    const imgId = await imageService.findByLink(adsLocationNew.img_link);

    console.log("adsLocationTypeId", adsLocationTypeId);

    const updateData = {
        adsLocationId: adsLocationId, 
        locationType: adsLocationTypeId.locationTypeId, 
        adsType: adsTypeId.adsTypeId,
        imgId:  imgId.imgId
    };

    const updatedAdsLocation = await adsLocation.patch(updateData);
    const updateStatus = await adsLocationModificationRequest.patch({requestId: requestId, status: "Đã duyệt"});
    return res.json({success: true, message: "Đã phê duyệt yêu cầu này thành công!"});
}

const viewDetail = async function(req, res){
    res.render("departmentOfficer/ads_location_modification_request/view_detail");
}

export default { index, getWardByDistrict, getRequestByWard, cancelRequest, acceptRequest, viewDetail };