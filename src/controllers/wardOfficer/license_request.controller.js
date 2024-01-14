import moment from "moment";
import licenseRequest from "../../services/departmentOfficer/license_request.service.js";

const index = async function (req, res) {
    const user = req.session.authUser;
    let empty = false;
    const license_request = await licenseRequest.findByWardId(user.wardId);

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

    res.render("wardOfficer/license_request", {
        empty: empty,
        license_request: license_requestWithIndex,
        date: currentDateTime
    });
};

const cancelRequest = async function(req, res){
    const licenseRequestId = req.body.licenseRequestId;
    const updateStatus = await licenseRequest.patch({licenseRequestId: licenseRequestId, status: "Đã hủy"});
    console.log("updateStatus: ", updateStatus);
    return res.json({success: true, message: "Đã hủy yêu cầu này thành công!"});
}

export default { index, cancelRequest };
