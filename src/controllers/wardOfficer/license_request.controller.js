import licenseService from "../../services/wardOfficer/license.service.js";
import moment from "moment";
const index = async (req, res) => {
    const wardId = req.session.authUser.wardId;
    const licenseArray = await licenseService.findByWardId(wardId);
    console.log("licenseArray",licenseArray);
    const licenseArrayWithIndex = licenseArray.map((license, index) => {
        return { ...license, stt: index + 1 };
    });
    for (let i = 0; i < licenseArrayWithIndex.length; i++) {
        licenseArrayWithIndex[i].startDate = moment(licenseArrayWithIndex[i].startDate).format('DD/MM/YYYY');
        licenseArrayWithIndex[i].endDate = moment(licenseArrayWithIndex[i].endDate).format('DD/MM/YYYY');
    
    }
    res.render("wardOfficer/license-request", {
        licenseArray: licenseArrayWithIndex,
        isEmpty: licenseArrayWithIndex.length === 0,
    });
}


export default { index }