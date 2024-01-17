import moment from "moment";
import licenseRequest from "../../services/departmentOfficer/license_request.service.js";
import district from "../../services/departmentOfficer/district.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";
import adsPanel from "../../services/departmentOfficer/ads_panel.service.js";

const index = async function (req, res) {
    let empty = false;
    const license_request = await licenseRequest.findAll();
    const districts = await district.findAll();
    if(!license_request || license_request.length === 0){
        empty = true;
    }

    let license_requestWithIndex = license_request.map((request, index) => ({
        ...request,
        startDate: moment(request.startDate).format('DD/MM/YYYY'),
        endDate: moment(request.endDate).format('DD/MM/YYYY'),
        stt: index + 1,
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/license_request/list", {
        empty: empty,
        license_request: license_requestWithIndex,
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
    const requests = await licenseRequest.findByWardId(req.body.wardId);

    let request = requests.map((request, index) => ({
        ...request,
        startDate: moment(request.startDate).format('DD/MM/YYYY'),
        endDate: moment(request.endDate).format('DD/MM/YYYY'),
        stt: index + 1,
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');
    console.log("request: ", request);
    return res.json({success: true, request: request, date: currentDateTime});   
}

const cancelRequest = async function(req, res){
    const licenseRequestId = req.body.licenseRequestId;
    const updateStatus = await licenseRequest.patch({licenseRequestId: licenseRequestId, status: "Đã hủy"});
    console.log("updateStatus: ", updateStatus);
    const updateStatusPanel = await adsPanel.patch({adsPanelId: req.body.adsPanelId, licenseId: null});
    return res.json({success: true, message: "Đã hủy yêu cầu này thành công!"});
}

const acceptRequest = async function(req, res){
    const licenseRequestId = req.body.licenseRequestId;
    const adsPanelId = req.body.adsPanelId;

    const updatedAdsPanel = await adsPanel.patch({adsPanelId: adsPanelId, licenseId: licenseRequestId});
    const updateStatus = await licenseRequest.patch({licenseRequestId: licenseRequestId, status: "Đã duyệt"});
    return res.json({success: true, message: "Đã phê duyệt yêu cầu này thành công!"});
}

export default { index, getWardByDistrict, getRequestByWard, cancelRequest, acceptRequest };
