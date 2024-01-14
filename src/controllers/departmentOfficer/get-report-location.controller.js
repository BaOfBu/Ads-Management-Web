import getReportLocationService from "../../services/departmentOfficer/get-report-location.service.js";

const getReportLocation = async function (req, res) {
    res.json(await getReportLocationService.findAllReportLocationBasic());
};
const getReportPanel = async function (req, res) {
    res.json(await getReportLocationService.findAllReportLocationByLocation(req.query.id));
};

export default { getReportLocation, getReportPanel };
