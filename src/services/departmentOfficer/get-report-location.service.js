import db from "../../utils/db.js";

export default {
    findAllReportLocationBasic() {
        return db("citizen_report")
            .select(
                "citizen_report.long as long",
                "citizen_report.lat as lat",
                "citizen_report.location as location",
                "report_type.name as reportTypeName",
                "citizen_report.name as name",
                "citizen_report.email as email",
                "citizen_report.phone as phone",
                "citizen_report.content as content",
                "img1.imgLink as imgId1",
                "img2.imgLink as imgId2",
                "citizen_report.sendDate as date",
                "citizen_report.status as status",
                "citizen_report.adsPanelId as adsPanelId",
                "ads_panel.adsLocationId as adsLocationId"
            )
            .leftJoin("ads_panel", "ads_panel.adsPanelId", "=", "citizen_report.adsPanelId")
            .join("report_type", "citizen_report.reportTypeId", "=", "report_type.reportTypeId")
            .leftJoin("image as img1", "citizen_report.imgId1", "=", "img1.imgId")
            .leftJoin("image as img2", "citizen_report.imgId2", "=", "img2.imgId");
    },
    async findAllReportLocationByLocation(adsLocationId) {
        return db("citizen_report")
            .select(
                "citizen_report.citizenReportId as reportId",
                "citizen_report.long as long",
                "citizen_report.lat as lat",
                "citizen_report.location as location",
                "report_type.name as reportTypeName",
                "citizen_report.name as name",
                "citizen_report.email as email",
                "citizen_report.phone as phone",
                "citizen_report.content as content",
                "img1.imgLink as imgId1",
                "img2.imgLink as imgId2",
                "citizen_report.sendDate as date",
                "citizen_report.status as status",
                "citizen_report.adsPanelId as adsPanelId",
                "ads_panel.adsLocationId as adsLocationId",
                "ads_panel.quantity as ads_panel_quantity",
                "ads_panel.height as ads_panel_height",
                "ads_panel.width as ads_panel_width",
                "ads_panel_type.name as ads_panel_type_name",
                "ads_type.name as ads_type",
                "location_type.name as location_type"
            )
            .leftJoin("ads_panel", "ads_panel.adsPanelId", "=", "citizen_report.adsPanelId")
            .join("report_type", "citizen_report.reportTypeId", "=", "report_type.reportTypeId")
            .leftJoin("image as img1", "citizen_report.imgId1", "=", "img1.imgId")
            .leftJoin("image as img2", "citizen_report.imgId2", "=", "img2.imgId")
            .join("ads_panel_type", "ads_panel.adsPanelTypeId", "=", "ads_panel_type.adsPanelTypeId")
            .join("ads_location", "ads_panel.adsLocationId", "=", "ads_location.adsLocationId")
            .join("location_type", "location_type.locationTypeId", "=", "ads_location.locationType")
            .join("ads_type", "ads_type.adsTypeId", "=", "ads_location.adsType")
            .where("ads_panel.adsLocationId", "=", Number(adsLocationId))
            .then(result => {
                // console.log("Query Result:", result);
                return result;
            })
            .catch(error => {
                console.error("Query Error:", error);
                throw error;
            });
    }
};
