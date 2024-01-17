import adsService from "../../services/wardOfficer/ads.service.js";
import moment from "moment";
import multer from "multer";
import fs from "fs";
import path from "path";
import { get } from "http";

const statusName = ["Đã quy hoạch","Chưa quy hoạch"];

const index = async function (req, res) {
    const user = req.session.authUser;
    //console.log("user",user);
    const wardName = await adsService.findWardByWardId(user.wardId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayAdsLocation = await adsService.findAllAdsLocationByWardId(user.wardId);
    // console.log("wardName",wardName);
    // console.log("districtName",districtName);
    //console.log("arrayAdsLocation",arrayAdsLocation);
    const adsLocationWithIndex = arrayAdsLocation.map((adsLocation, index) => ({
        ...adsLocation,
        stt: index + 1
    }));
    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY')
    res.render("wardOfficer/ads_location", {
        wardName: wardName.name,
        districtName: districtName.name,
        arrayAdsLocation: adsLocationWithIndex,
        date: currentDateTime,
        isEmpty: adsLocationWithIndex.length == 0
    });
}

const viewDetails = async function (req, res) {
    const ads_panel = await adsService.findAllAdsPanelByAdsLocationId(req.query.adsLocationId);
    const adsLocationName = await adsService.findAdsLocationName(req.query.adsLocationId);
    //console.log("ads_panel",ads_panel);
    //console.log("adsLocationName",adsLocationName);
    const adsPanelWithIndex = ads_panel.map((adsPanel, index) => ({
        ...adsPanel,
        stt: index + 1
    }));
    //console.log("adsPanelWithIndex",adsPanelWithIndex);
    //console.log("Length",adsPanelWithIndex.length==0);
    const isEmpty = adsPanelWithIndex.length == 0;
    //console.log("isEmpty",isEmpty);
    res.render("wardOfficer/ads_panel", {
        adsLocationName: adsLocationName.location,
        adsPanel: adsPanelWithIndex,
        isEmpty: isEmpty
    })
};

const viewPanelDetails = async function (req, res) {
    const ads_panel = await adsService.findAdsPanel(req.query.adsPanelId);
    console.log("ads_panel",ads_panel);
    res.render("wardOfficer/ads_panel_detail", {
        adsPanel: ads_panel
    })
}

const getEditAdsLocation = async function (req, res) {
    //console.log("req.query",req.query);
    const adsLocation = await adsService.findAdsLocation(req.query.adsLocationId);
    //console.log("adsLocation nè",adsLocation);
    const LocationType = await adsService.findAllLocationTypeName();
    const adsType = await adsService.findAllAdsTypeName();
    //console.log("adsLocation",adsLocation);

    res.render("wardOfficer/edit_ads_location", {
        status: statusName,
        adsLocation: adsLocation,
        locationType: LocationType,
        adsType: adsType
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


export default { index, viewDetails, viewPanelDetails, getEditAdsLocation, getEditAdsPanel};