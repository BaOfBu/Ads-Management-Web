import getAdsLocationService from "../../services/departmentOfficer/get-ads-location.service.js";
const getAdsLocation = async function(req, res) {
    res.json(await getAdsLocationService.findAllAdsLocationBasic());
};

const getAdsLocationByWard = async function(req, res) {
    //console.log(req.query.wardId);
    res.json(await getAdsLocationService.findAllAdsLocationByWard(Number(req.query.wardId)));
}
export default { getAdsLocation, getAdsLocationByWard};
