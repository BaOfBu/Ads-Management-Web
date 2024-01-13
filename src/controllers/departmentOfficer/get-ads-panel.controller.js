import getAdsPanelService from "../../services/departmentOfficer/get-ads-panel.service.js";
const getAdsPanel = async function getAdsLocation(req, res) {
    res.json(await getAdsPanelService.findAllAdsPanelnBasic(req.query.entity));
};
export default { getAdsPanel };
