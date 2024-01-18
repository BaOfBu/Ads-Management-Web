import adsService from "../../services/districtOfficer/ads.service.js";
import moment from "moment";
import adsPanelService from "../../services/districtOfficer/ads_panel.service.js";

const index = async (req, res, next) => {
    const user = req.session.authUser;
    //console.log("user",user);
    const wards = await adsService.findAllWardByDistrictId(user.districtId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayAdsPanel = await adsPanelService.findAllAdsPanelByDistrictId(user.districtId);
    const adsPanelWithIndex = arrayAdsPanel.map((adsPanel, index) => ({
        ...adsPanel,
        stt: index + 1
    }));
    console.log("adsPanelWithIndex",adsPanelWithIndex);
    return res.render("districtOfficer/ads_panel_list", {
        wards: wards,
        districtName: districtName.name,
        arrayAdsPanel: adsPanelWithIndex,
        isEmpty: adsPanelWithIndex.length == 0
    });
}

const postAdsPanel = async function (req, res) {
    //console.log("req.body:", req.body);
    const keyword = req.body.keyword || "";
    const user = req.session.authUser;
    const wards = req.body.wards || [];
    //console.log("user",user);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayAdsPanel = await adsPanelService.findAllAdsPanelByDistrictIdAndKeyword(keyword,wards);
    const adsPanelWithIndex = arrayAdsPanel.map((adsPanel, index) => ({
        ...adsPanel,
        stt: index + 1
    }));
    res.json({
        wards: wards,
        districtName: districtName.name,
        arrayAdsPanel: adsPanelWithIndex,
        isEmpty: adsPanelWithIndex.length == 0
    });
}
const viewPanelDetails = async function (req, res) {
    //console.log("req.query.adsPanelId",req.query.adsPanelId);
    const ads_panel = await adsService.findAdsPanel(req.query.adsPanelId);
    //console.log("ads_panel",ads_panel);
    if(ads_panel.licenseId != null){
        ads_panel.startDate = moment(ads_panel.startDate).format('DD/MM/YYYY');
        ads_panel.endDate = moment(ads_panel.endDate).format('DD/MM/YYYY');    
    }    
    console.log("ads_panel",ads_panel);
    res.render("districtOfficer/ads_panel_detail", {
        adsPanel: ads_panel
    })
}

const getEditAdsPanel = async function (req, res) {
    const adsPanelType = await adsService.findAllAdsPanelType();
    const adsPanel = await adsService.findAdsPanel(req.query.adsPanelId);
    //console.log("adsPanel",adsPanel);
    //console.log("adsPanelType",adsPanelType);
    res.render("districtOfficer/edit_ads_panel", {
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
    return res.redirect("/district-officer/ads-panel/");
}

export default { index, postAdsPanel, viewPanelDetails, getEditAdsPanel, postEditAdsPanel };