import adsService from "../../services/wardOfficer/ads.service.js";
import moment from "moment";
import adsPanelService from "../../services/wardOfficer/ads_panel.service.js";

const index = async (req, res, next) => {
    const user = req.session.authUser;
    //console.log("user",user);
    const wardName = await adsService.findWardByWardId(user.wardId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayAdsPanel = await adsPanelService.findAllAdsPanelByWardId(user.wardId);
    const adsPanelWithIndex = arrayAdsPanel.map((adsPanel, index) => ({
        ...adsPanel,
        stt: index + 1
    }));
    res.render("wardOfficer/ads_panel_list", {
        wardName: wardName.name,
        districtName: districtName.name,
        arrayAdsPanel: adsPanelWithIndex,
        isEmpty: adsPanelWithIndex.length == 0
    });
}

const viewPanelDetails = async function (req, res) {
    //console.log("req.query.adsPanelId",req.query.adsPanelId);
    const ads_panel = await adsService.findAdsPanel(req.query.adsPanelId);
    //console.log("ads_panel",ads_panel);
    res.render("wardOfficer/ads_panel_detail", {
        adsPanel: ads_panel
    })
}

const getEditAdsPanel = async function (req, res) {
    const adsPanelType = await adsService.findAllAdsPanelType();
    const adsPanel = await adsService.findAdsPanel(req.query.adsPanelId);
    //console.log("adsPanel",adsPanel);
    //console.log("adsPanelType",adsPanelType);
    res.render("wardOfficer/edit_ads_panel", {
        adsPanelType : adsPanelType,
        adsPanel : adsPanel
    })
}

const postEditAdsPanel = async function (req, res) {
    console.log("req.body:", req.body);
    const adsLocation = await adsService.findAdsLocationRaw(req.body.txtAdsLocationId);
    const ward = await adsService.findWardByWardId(adsLocation.wardId);
    const entity = {
        AdsPanelId: req.body.txtAdsPanelId,
        AdsLocationId: req.body.txtAdsLocationId,
        AdsPanelTypeId : req.body.adsPanelType,
        RequestReason : req.body.RequestReason,
        WardId : adsLocation.wardId,
        status:"Chưa duyệt",
        RequestTime: new Date(),
        districtId: ward.districtId,
        Height: req.body.Height,
        Width: req.body.Width,
        Quantity: req.body.Quantity,

    }
    const ads_panel_edit = await adsService.createAdsPanelEdit(entity);
    //const update = await adsService.updateMerchantInfo(userID, { image: req.body.image });
    //return res.json({ success: true, image: req.body.image });
    return res.redirect("/ward-officer/ads-panel/");
}

export default { index, viewPanelDetails, getEditAdsPanel, postEditAdsPanel };