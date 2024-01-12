import moment from "moment";
import adsPanel from "../../services/departmentOfficer/ads_panel.service.js";

const index = async function (req, res) {
    const empty = false;
    const ads_panels = await adsPanel.findAll();

    console.log("List ads_panels: ", ads_panels);

    if(!ads_panels || ads_panels.length === 0){
        empty = true;
    }

    const ads_panelsWithIndex = ads_panels.map((ads_panel, index) => ({
        ...ads_panel,
        stt: index + 1,
    }));

    console.log("List có index: ", ads_panelsWithIndex);

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/management_ads_panel/ads_panel", {
        empty: empty,
        ads_panels: ads_panelsWithIndex,
        date: currentDateTime
    });
};

export default { index };
