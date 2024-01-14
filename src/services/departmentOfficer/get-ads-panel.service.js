import db from "../../utils/db.js";

export default {
    findAllAdsPanelnBasic(entity) {
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
            .where("ads_panel.adsLocationId", "=", adsLocationId);
    }
};
