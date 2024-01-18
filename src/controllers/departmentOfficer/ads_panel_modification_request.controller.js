import moment from "moment";
import adsPanelModificationRequest from "../../services/departmentOfficer/ads_panel_modification_request.service.js";
import adsPanel from "../../services/departmentOfficer/ads_panel.service.js";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";
import adsPanelType from "../../services/departmentOfficer/provided_infor.service.js";
import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";
import district from "../../services/departmentOfficer/district.service.js";

function generatePagination(request, districtId, wardId, pageCurrent){
    const limit = 8;
    const page = pageCurrent;
    const offset = (page - 1) * limit;

    const total = request.length;
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

    let list = request;
    if(total > offset){
        list = request.slice(offset, offset+limit); 
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
    const wards = await ward.findAllByDistrictId(districtCurrent);
    let districtName = "Tất cả quận";
    let wardName = "Tất cả phường";

    const edit_ads_panels_request = await getListByWard(wardCurrent, districtCurrent);
    if (districtCurrent !== -1 && districtCurrent !== "-1"){
        const tmpDistrict = await providedInfo.findById('district', 'districtId', districtCurrent);
        districtName = "Quận " + tmpDistrict.name;
    } 
    if (wardCurrent !== -1 && wardCurrent !== "-1"){
        const tmpWard = await providedInfo.findById('ward', 'wardId', wardCurrent);
        wardName = "Phường " + tmpWard.name;
    } 

    if(!edit_ads_panels_request || edit_ads_panels_request.length === 0){
        empty = true;
    }

    const pagination = generatePagination(edit_ads_panels_request, districtCurrent, wardCurrent, page);

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/ads_panel_modification_request/list", {
        empty: empty,
        edit_ads_panels_request: pagination.list,
        districts: districts,
        date: currentDateTime,
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
    let requests;
    console.log("districtId: ", districtId);
    console.log("wardId: ", wardId);
    if(wardId === -1 || wardId === "-1"){
        if(districtId === -1 || districtId === "-1"){
            console.log("Đã vô đây");
            requests = await adsPanelModificationRequest.findAll();   
            console.log("requests: ", requests);
        }else{
            requests = await adsPanelModificationRequest.findAllByDistrict(districtId);
        }  
    }else{
        requests = await adsPanelModificationRequest.findByWardId(wardId);
    }

    let list = requests.map((request, index) => ({
        ...request,
        requestTime: moment(request.requestTime).format("DD/MM/YYYY"),
        stt: index + 1,
    }));

    return list;
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

export default { index, getWardByDistrict, cancelRequest, acceptRequest};
