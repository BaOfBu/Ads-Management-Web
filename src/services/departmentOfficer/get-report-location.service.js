import db from "../../utils/db.js";
export default {
    findAllReportLocationBasic() {
        return db("citizen_report").select(
            "citizen_report.*",
            "location as location",
            "status as status",
            "lat as lat",
            "long as long",
            "name as name",
            "email as email",
            "phone as phone",
            "content as content",
            // "reportTypeId.name as report_type_name"
            // "imgId.imgLink as image_link",
            "sendDate as date"
        );
        // .join("image", "citizen_report.imgId", "=", "image.imgId");
        // .join("report_type", "citizen_report.reportTypeId", "=", "report_type.report_type_name")
    }
};
