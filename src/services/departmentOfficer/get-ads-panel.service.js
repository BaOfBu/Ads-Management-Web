import db from "../../utils/db.js";

export default {
    findAllAdsPanelnBasic(entity) {
        const adsLocationId = parseInt(entity, 10);
        return db("ads_panel")
            .select(
                "ads_panel.adsPanelId as adsPanelId",
                "ads_panel_type.name as adsPanelType",
                "ads_panel.licenseId as licenseId",
                "ads_panel.height as height",
                "ads_panel.quantity as quantity",
                "ads_panel.width as width",
                "image.imgLink as img",
                "license_request.status as status",
                "license_request.endDate as endDate"
            )
            .leftJoin("license_request", "license_request.licenseRequestId", "=", "ads_panel.licenseId")
            .join("ads_panel_type", "ads_panel.adsPanelTypeId", "=", "ads_panel_type.adsPanelTypeId")
            .leftJoin("image", "image.imgId", "=", "license_request.imgId")
            .where("ads_panel.adsLocationId", "=", adsLocationId);
    },
    findAllAdsPaneByWard(entity, wardId) {
        const adsLocationId = parseInt(entity, 10);
        return db("ads_panel")
            .select(
                "ads_panel.adsPanelId as adsPanelId",
                "ads_panel_type.name as adsPanelType",
                "ads_panel.licenseId as licenseId",
                "ads_panel.height as height",
                "ads_panel.quantity as quantity",
                "ads_panel.width as width",
                "license_request.content as content",
                "image.imgLink as img",
                "license_request.nameCompany as company",
                "license_request.phoneCompany as phoneCompany",
                "license_request.emailCompany as emailCompany",
                "license_request.locationCompany as locationCompany",
                "license_request.startDate as startDate",
                "license_request.endDate as endDate"
            )
            .join("ads_panel_type", "ads_panel.adsPanelTypeId", "=", "ads_panel_type.adsPanelTypeId")
            .join("ads_location", "ads_panel.adsLocationId", "=", "ads_location.adsLocationId")
            .leftJoin("license_request", "license_request.licenseRequestId", "=", "ads_panel.licenseId")
            .leftJoin("image", "image.imgId", "=", "license_request.imgId")
            .where("ads_panel.adsLocationId", "=", adsLocationId)
            .andWhere("ads_location.wardId", "=", wardId);
    }
};
