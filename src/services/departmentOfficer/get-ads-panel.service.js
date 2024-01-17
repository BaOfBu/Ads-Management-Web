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
                "license_request.status as status"
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
                "adsPanelId as adsPanelId",
                "ads_panel_type.name as adsPanelType",
                "licenseId as licenseId",
                "height as height",
                "quantity as quantity",
                "width as width"
            )
            .join("ads_panel_type", "ads_panel.adsPanelTypeId", "=", "ads_panel_type.adsPanelTypeId")
            .join("ads_location", "ads_panel.adsLocationId", "=", "ads_location.adsLocationId")
            .where("ads_panel.adsLocationId", "=", adsLocationId)
            .andWhere("ads_location.wardId", "=", wardId);
    }
};
