import getAdsPanelService from "../../services/departmentOfficer/get-ads-panel.service.js";
const getAdsPanel = async function(req, res) {
    res.json(await getAdsPanelService.findAllAdsPanelnBasic(req.query.entity));
};

const getAdsPanelByWard = async function(req, res) {
    //console.log(req.query.entity, req.query.wardId);
    res.json(await getAdsPanelService.findAllAdsPaneByWard(req.query.entity, req.query.wardId));
};
export default { getAdsPanel, getAdsPanelByWard };
