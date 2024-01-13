import moment from "moment";
import adsPanelModificationRequest from "../../services/departmentOfficer/ads_panel_modification_request.service.js";


const index = async function (req, res) {
    let empty = false;
    const edit_ads_panels_request = await adsPanelModificationRequest.findAll();

    console.log("List edit_ads_panels_request: ", edit_ads_panels_request);

    if(!edit_ads_panels_request || edit_ads_panels_request.length === 0){
        empty = true;
    }

    let edit_ads_panels_requestWithIndex = edit_ads_panels_request.map((request, index) => ({
        ...request,
        requestTime: moment(request.requestTime).format('DD/MM/YYYY HH:mm:ss'),
        stt: index + 1,
    }));

    // edit_ads_panels_requestWithIndex.requestTime = moment(edit_ads_panels_requestWithIndex.requestTime).format('HH:mm:ss DD/MM/YYYY');
    
    console.log("List có index: ", edit_ads_panels_requestWithIndex);
    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/ads_panel_modification_request/list", {
        empty: empty,
        edit_ads_panels_request: edit_ads_panels_requestWithIndex,
        date: currentDateTime
    });
};

export default { index};
