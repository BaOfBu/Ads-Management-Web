import moment from "moment";
import licenseRequest from "../../services/departmentOfficer/license_request.service.js";
import district from "../../services/departmentOfficer/district.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";
import adsPanel from "../../services/departmentOfficer/ads_panel.service.js";
import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";

function generatePagination(license_requests, districtId, wardId, pageCurrent){
    const limit = 8;
    const page = pageCurrent;
    const offset = (page - 1) * limit;

    const total = license_requests.length;
    const nPages = Math.ceil(total / limit);

    console.log("total: ", total);
    console.log("nPages: ", nPages);

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

    let list = license_requests;
    if(total > offset){
        list = license_requests.slice(offset, offset+limit); 
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
    // const license_request = await licenseRequest.findAll();
    const districts = await district.findAll();
    const districtCurrent = req.query.districtId || -1;
    const wardCurrent = req.query.wardId || -1;
    const page = req.query.page || 1;
    const license_request = await getListByWard(wardCurrent, districtCurrent);
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

    if(!license_request || license_request.length === 0){
        empty = true;
    }

    // let license_requestWithIndex = license_request.map((request, index) => ({
    //     ...request,
    //     startDate: moment(request.startDate).format('DD/MM/YYYY'),
    //     endDate: moment(request.endDate).format('DD/MM/YYYY'),
    //     stt: index + 1,
    // }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    const pagination = generatePagination(license_request, districtCurrent, wardCurrent, page);

    res.render("departmentOfficer/license_request/list", {
        empty: empty,
        license_request: pagination.list,
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
    let license_requests;
    console.log("districtId: ", districtId);
    console.log("wardId: ", wardId);
    if(wardId === -1 || wardId === "-1"){
        if(districtId === -1 || districtId === "-1"){
            console.log("Đã vô đây");
            license_requests = await licenseRequest.findAll();   
        }else{
            license_requests = await licenseRequest.findAllByDistrict(districtId);
        }  
    }else{
        license_requests = await licenseRequest.findByWardId(wardId);
    }

    let license_request = license_requests.map((request, index) => ({
        ...request,
        startDate: moment(request.startDate).format('DD/MM/YYYY'),
        endDate: moment(request.endDate).format('DD/MM/YYYY'),
        stt: index + 1,
    }));

    return license_request;
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
    console.log("cancel body: ", req.body);
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

const viewDetail = async function(req, res){
    console.log("query of view detail: ", req.query);
    const licenseRequestId = req.query.licenseRequestId;
    const stt = req.query.stt;

    const license_request = await licenseRequest.findById(licenseRequestId);
    console.log("license_request: ", license_request);

    license_request.startDate = moment(license_request.startDate).format('DD/MM/YYYY');
    license_request.endDate = moment(license_request.endDate).format('DD/MM/YYYY'),

    console.log("license_request: ", license_request);
    res.render("departmentOfficer/license_request/view_detail", {
        stt: stt,
        license_request: license_request,
    });
}

export default { index, getWardByDistrict, getRequestByWard, cancelRequest, acceptRequest, viewDetail };
