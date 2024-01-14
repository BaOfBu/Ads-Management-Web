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
                "citizen_report.adsPanelId as adsPanelId"
            )
            .join("report_type", "citizen_report.reportTypeId", "=", "report_type.reportTypeId")
            .leftJoin("image as img1", "citizen_report.imgId1", "=", "img1.imgId")
            .leftJoin("image as img2", "citizen_report.imgId2", "=", "img2.imgId");
    }
};
