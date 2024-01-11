import getReportLocationService from "../../services/departmentOfficer/get-report-location.service.js";

const getReportLocation = async function (req, res) {
    res.json(await getReportLocationService.findAllReportLocationBasic());
};

export default { getReportLocation };
