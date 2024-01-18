import adsService from "../../services/wardOfficer/ads.service.js";
import moment from "moment";
import adsPanelService from "../../services/wardOfficer/ads_panel.service.js";

const index = async (req, res, next) => {
    const user = req.session.authUser;
    const page = req.query.page || 1;
    const keyword = req.query.keyword || "";
    const limit = 5;
    const offset = (page - 1) * limit;
    //console.log("user",user);
    const wardName = await adsService.findWardByWardId(user.wardId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    var arrayAdsPanel = await adsPanelService.findAllAdsPanelByWardId(user.wardId);
    if(keyword != ""){
        arrayAdsPanel = await adsPanelService.findAllAdsPanelByWardIdAndKeyword(user.wardId,keyword);
    }
    const length = arrayAdsPanel.length;
    const nPages = Math.ceil(length / limit);
    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
        value: i,
        isActive: i === +page
        });
    }
    const previousValue = page == 1 ? 1 : page - 1;
    const nextValue = page == nPages ? nPages : +page + 1;
    const adsPanelWithIndex = arrayAdsPanel.map((adsPanel, index) => ({
        ...adsPanel,
        stt: index + 1
    }));
    const newArrayAdsLocation = adsPanelWithIndex.slice(offset, limit+offset);
    return res.render("wardOfficer/ads_panel_list", {
        type: "ads_panel",
        wardName: wardName.name,
        districtName: districtName.name,
        arrayAdsPanel: newArrayAdsLocation,
        isEmpty: adsPanelWithIndex.length == 0,
        pageNumbers : pageNumbers,
        oldKeyword: keyword,
        previousValue: previousValue,
        nextValue: nextValue,
    });
}

const postAdsPanel = async function (req, res) {
    //console.log("req.body:", req.body);
    const keyword = req.body.keyword || "";
    const user = req.session.authUser;
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    //console.log("user",user);
    const wardName = await adsService.findWardByWardId(user.wardId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayAdsPanel = await adsPanelService.findAllAdsPanelByWardIdAndKeyword(user.wardId,keyword);
    const length = arrayAdsPanel.length;
    const nPages = Math.ceil(length / limit);
    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
        value: i,
        isActive: i === +page
        });
    }
    const previousValue = page == 1 ? 1 : page - 1;
    const nextValue = page == nPages ? nPages : +page + 1;
    const adsPanelWithIndex = arrayAdsPanel.map((adsPanel, index) => ({
        ...adsPanel,
        stt: index + 1
    }));
    const newArrayAdsLocation = adsPanelWithIndex.slice(offset, limit+offset);
    return res.render("wardOfficer/ads_panel_list", {
        type: "ads_panel",
        wardName: wardName.name,
        districtName: districtName.name,
        arrayAdsPanel: newArrayAdsLocation,
        isEmpty: adsPanelWithIndex.length == 0,
        pageNumbers : pageNumbers,
        oldKeyword: keyword,
        previousValue: previousValue,
        nextValue: nextValue,
    });
}
const viewPanelDetails = async function (req, res) {
    //console.log("req.query.adsPanelId",req.query.adsPanelId);
    const ads_panel_array = await adsService.findAdsPanel(req.query.adsPanelId);
    console.log("ads_panel_array",ads_panel_array.length);
    var ads_panel = null;
    for(let i = 0; i < ads_panel_array.length; i++){
        if(ads_panel_array[i].license_status == "Đã duyệt"){
            ads_panel = ads_panel_array[i];
            break;
        }
    }
    if(ads_panel == null){
        for(let i = 0; i < ads_panel_array.length; i++){
            if(ads_panel_array[i].license_status == "Chưa duyệt"){
                ads_panel = ads_panel_array[i];
                break;
            }
        }
    }
    //console.log("ads_panel",ads_panel);
    if(ads_panel.licenseId != null){
        ads_panel.startDate = moment(ads_panel.startDate).format('DD/MM/YYYY');
        ads_panel.endDate = moment(ads_panel.endDate).format('DD/MM/YYYY');    
    } 
    const returnUrl = req.headers.referer;
    console.log("ads_panel",ads_panel);
    res.render("wardOfficer/ads_panel_detail", {
        type: "ads_panel",
        adsPanel: ads_panel,
        returnUrl: returnUrl
    })
}

const getEditAdsPanel = async function (req, res) {
    const adsPanelType = await adsService.findAllAdsPanelType();
    const adsPanel = await adsService.findAdsPanel(req.query.adsPanelId);
    //console.log("adsPanel",adsPanel);
    //console.log("adsPanelType",adsPanelType);
    res.render("wardOfficer/edit_ads_panel", {
        type: "ads_panel",
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

export default { index, postAdsPanel, viewPanelDetails, getEditAdsPanel, postEditAdsPanel };