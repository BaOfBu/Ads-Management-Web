import adsService from "../../services/districtOfficer/ads.service.js";
import moment from "moment";
import multer from "multer";
import fs from "fs";
import path from "path";
import { get } from "http";

const statusName = ["Đã quy hoạch","Chưa quy hoạch"];

const index = async function (req, res) {
    const user = req.session.authUser;
    const page = req.query.page || 1;
    const keyword = req.query.keyword || "";
    const limit = 4;
    const offset = (page - 1) * limit;
    //console.log("user",user);
    const wards = await adsService.findAllWardByDistrictId(user.districtId);
    //console.log("wards",wards);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    var arrayAdsLocation = await adsService.findAllAdsLocationByWardId(user.wardId);
    if(keyword != ""){
        arrayAdsLocation = await adsService.findAllAdsLocationByKeyword(user.wardId,keyword);
    }
    // console.log("wardName",wardName);
    // console.log("districtName",districtName);
    //console.log("arrayAdsLocation",arrayAdsLocation);
    const length = arrayAdsLocation.length;
    //console.log("length",length);
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
    const adsLocationWithIndex = arrayAdsLocation.map((adsLocation, index) => ({
        ...adsLocation,
        stt: index + 1
    }));
    const newArray = adsLocationWithIndex.slice(offset, offset + limit);
    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY')
    return res.render("districtOfficer/ads_location", {
        type: "ads_location",
        districtName: districtName.name,
        arrayAdsLocation: newArray,
        date: currentDateTime,
        isEmpty: adsLocationWithIndex.length == 0,
        wards: wards,
        pageNumbers : pageNumbers,
        previousValue: previousValue,
        nextValue: nextValue,
    });
}

const postAdsLocation = async function (req, res) {
    //console.log("req.body:", req.body);
    const keyword = req.body.keyword || "";
    const user = req.session.authUser;
    const wards = req.body.wards || [];
    const page = req.body.page || 1;
    const limit = 4;
    const offset = (page - 1) * limit;
    //console.log("user",user);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayAdsLocation = await adsService.findAllAdsLocationByKeyword(keyword,wards);
    // console.log("wardName",wardName);
    // console.log("districtName",districtName);
    const length = arrayAdsLocation.length;
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
    const adsLocationWithIndex = arrayAdsLocation.map((adsLocation, index) => ({
        ...adsLocation,
        stt: index + 1
    }));

    const newArray = adsLocationWithIndex.slice(offset, limit+offset);
    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY')
    // return res.render("districtOfficer/ads_location", {
    //     wardName: wardName.name,
    //     districtName: districtName.name,
    //     arrayAdsLocation: adsLocationWithIndex,
    //     date: currentDateTime,
    //     isEmpty: adsLocationWithIndex.length == 0
    // });
    res.json({
        districtName: districtName.name,
        arrayAdsLocation: newArray,
        date: currentDateTime,
        isEmpty: adsLocationWithIndex.length == 0,
        wards: wards,
        pageNumbers : pageNumbers,
        previousValue: previousValue,
        nextValue: nextValue,
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
    res.render("districtOfficer/ads_panel", {
        type: "ads_location",
        adsLocationName: adsLocationName.location,
        adsPanel: adsPanelWithIndex,
        isEmpty: isEmpty
    })
};

const viewPanelDetails = async function (req, res) {
    //console.log("req.query.adsPanelId",req.query.adsPanelId);
    const ads_panel = await adsService.findAdsPanel(req.query.adsPanelId);
    const url  = req.url;
    console.log("url",url);
    var returnUrl = "";
    if(url.includes("view-panel-detail")){
        returnUrl = "/district-officer/ads/view-detail?adsLocationId="+ads_panel.adsLocationId;
    }
    else{
        returnUrl = "/district-officer/ads-panel";
    }
    //console.log("ads_panel nè",ads_panel);
    res.render("districtOfficer/ads_panel_detail", {
        type: "ads_location",
        adsPanel: ads_panel,
        returnUrl: returnUrl
    })
}

const getEditAdsLocation = async function (req, res) {
    //console.log("req.query",req.query);
    const adsLocation = await adsService.findAdsLocation(req.query.adsLocationId);
    //console.log("adsLocation nè",adsLocation);
    const LocationType = await adsService.findAllLocationTypeName();
    const adsType = await adsService.findAllAdsTypeName();
    //console.log("adsLocation",adsLocation);

    res.render("districtOfficer/edit_ads_location", {
        type: "ads_location",
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
    res.render("districtOfficer/edit_ads_panel", {
        type: "ads_location",
        adsPanelType : adsPanelType,
        adsPanel : adsPanel
    })
}

const licenseRequest = async function (req, res) {
    const adsPanelId = req.query.adsPanelId;
    let available = true;

    let adsPanel = await adsService.findLicenseRequestOfAdsPanel(adsPanelId);

    console.log("adsPanel: ", adsPanel);

    if (adsPanel.status === "Chưa duyệt" || adsPanel.status === "Đã duyệt") {
        adsPanel.startDate = moment(adsPanel.startDate).format("DD/MM/YYYY");
        adsPanel.endDate = moment(adsPanel.endDate).format("DD/MM/YYYY");
        res.render("wardOfficer/license_request_AdsPanelScreen", {
            adsPanel: adsPanel,
            available: available
        });
    } else {
        available = false;
        const lengthImg = await imageService.findAll();

        res.render("districtOfficer/license_request_AdsPanelScreen", {
            type: "ads_location",
            adsPanel: adsPanel,
            available: available,
            lengthImg: lengthImg[lengthImg.length - 1].imgId + 1
        });
    }
};

const handleAddNewRequest = async function (req, res) {
    console.log("Before: ", req.body);
    const user = req.session.authUser;
    console.log("user: ", user);
    delete req.body.image;
    delete req.body.adsPanelTypeId;
    req.body.wardId = user.wardId;
    req.body.districtId = user.districtId;
    req.body.emailSender = user.email;
    req.body.status = "Chưa duyệt";

    const splitStartDate = req.body.startDate.split("/");
    const tempStart = splitStartDate[2] + "-" + splitStartDate[1] + "-" + splitStartDate[0];
    req.body.startDate = new Date(tempStart + " 00:00:00");

    const splitEndDate = req.body.endDate.split("/");
    const tempEnd = splitEndDate[2] + "-" + splitEndDate[1] + "-" + splitEndDate[0];
    req.body.endDate = new Date(tempEnd + " 00:00:00");

    const request = await newLicenseRequest.add(req.body);

    console.log("request: ", request[0]);
    const updatAdsPanel = await adsPanel.patch({ adsPanelId: req.body.adsPanelId, licenseId: request[0] });
    res.redirect(`/district-officer/ads/license-request?adsPanelId=${req.body.adsPanelId}`);
};


export default { index, viewDetails, viewPanelDetails, getEditAdsLocation, getEditAdsPanel, postAdsLocation};