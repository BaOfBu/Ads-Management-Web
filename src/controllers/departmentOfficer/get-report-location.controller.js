import getReportLocationService from "../../services/departmentOfficer/get-report-location.service.js";

const getReportLocation = async function (req, res) {
    res.json(await getReportLocationService.findAllReportLocationBasic());
};

const getReportLocationByWard = async function (req, res) {
    res.json(await getReportLocationService.findAllReportLocationByWard(req.query.wardId));
};

export default { getReportLocation, getReportLocationByWard };
