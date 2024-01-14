import moment from "moment";
import adsPanelModificationRequest from "../../services/departmentOfficer/ads_panel_modification_request.service.js";
import adsPanel from "../../services/departmentOfficer/ads_panel.service.js";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";
import adsPanelType from "../../services/departmentOfficer/provided_infor.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";
import district from "../../services/departmentOfficer/district.service.js";

const index = async function (req, res) {
    let empty = false;
    const edit_ads_panels_request = await adsPanelModificationRequest.findAll();
    const districts = await district.findAll();
    if(!edit_ads_panels_request || edit_ads_panels_request.length === 0){
        empty = true;
    }

    let edit_ads_panels_requestWithIndex = edit_ads_panels_request.map((request, index) => ({
        ...request,
        requestTime: moment(request.requestTime).format('DD/MM/YYYY HH:mm:ss'),
        stt: index + 1,
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/ads_panel_modification_request/list", {
        empty: empty,
        edit_ads_panels_request: edit_ads_panels_requestWithIndex,
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
    const requests = await adsPanelModificationRequest.findByWardId(req.body.wardId);

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
    const updateStatus = await adsPanelModificationRequest.patch({requestId: requestId, status: "Đã hủy"});
    console.log("updateStatus: ", updateStatus);
    return res.json({success: true, message: "Đã hủy yêu cầu này thành công!"});
}

const acceptRequest = async function(req, res){
    const requestId = req.body.requestId;
    const adsPanelId = req.body.adsPanelId;
    const adsPanelNew = req.body.adsPanelNew;

    const adsLocationId = await adsLocation.findByName(adsPanelNew.ads_location);
    const adsPanelTypeId = await adsPanelType.findByName('ads_panel_type', adsPanelNew.ads_panel_type);

    const updateData = {
        adsPanelId: adsPanelId, 
        adsLocationId: adsLocationId.adsLocationId, 
        adsPanelTypeId: adsPanelTypeId.adsPanelId, 
        width: adsPanelNew.width,
        height: adsPanelNew.height,
        quantity: adsPanelNew.quantity
    };

    const updatedAdsPanel = await adsPanel.patch(updateData);
    const updateStatus = await adsPanelModificationRequest.patch({requestId: requestId, status: "Đã duyệt"});
    return res.json({success: true, message: "Đã phê duyệt yêu cầu này thành công!"});
}

export default { index, getWardByDistrict, getRequestByWard, cancelRequest, acceptRequest};
