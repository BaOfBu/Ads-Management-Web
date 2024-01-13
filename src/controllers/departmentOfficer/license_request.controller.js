import moment from "moment";
import licenseRequest from "../../services/departmentOfficer/license_request.service.js";
import district from "../../services/departmentOfficer/district.service.js";

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

export default { index };
