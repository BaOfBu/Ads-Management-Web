import moment from "moment";
import adsLocation from "../../services/departmentOfficer/ads_location.service.js";

const index = async function (req, res) {
    const empty = false;
    const ads_locations = await adsLocation.findAll();
    console.log("List ads_locations: ", ads_locations);

    if(!ads_locations || ads_locations.length === 0){
        empty = true;
    }

    const ads_locationsWithIndex = ads_locations.map((ads_location, index) => ({
        ...ads_location,
        stt: index + 1,
        // description: district.description ? district.description.slice(0, 50) + " ..." : "",
    }));

    console.log("List có index: ", ads_locationsWithIndex);

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/management_ads_location/ads_location", {
        empty: empty,
        ads_locations: ads_locationsWithIndex,
        date: currentDateTime
    });
};

export default { index };
