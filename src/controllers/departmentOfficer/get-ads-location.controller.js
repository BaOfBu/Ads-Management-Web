import getAdsLocationService from "../../services/departmentOfficer/get-ads-location.service.js";

const getAdsLocation = async function getAdsLocation(req, res) {
    res.json(await getAdsLocationService.findAllAdsLocationBasic());
};

export default { getAdsLocation };
