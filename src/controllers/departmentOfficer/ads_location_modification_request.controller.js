import moment from "moment";
import adsLocationModificationRequest from "../../services/departmentOfficer/ads_location_modification_request.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";
import district from "../../services/departmentOfficer/district.service.js";

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
export default { index, getWardByDistrict, getRequestByWard };