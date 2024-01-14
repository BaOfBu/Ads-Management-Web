import db from "../../utils/db.js";
export default {
    saveReportFromEmptyPoint(entity) {
        return db("citizen_report").insert({
            email: entity.email,
            long: entity.long,
            lat: entity.lat,
            location: entity.location,
            reportTypeId: entity.reportTypeId,
            name: entity.name,
            phone: entity.phone,
            content: entity.content,
            imgId1: entity.imgId1,
            imgId2: entity.imgId2,
            sendDate: entity.sendDate,
            status: "Đang xử lý",
            adsPanelId: null
        });
    },
    saveReportFromAdsPoint(entity) {
        return db("citizen_report").insert({
            email: entity.email,
            long: entity.long,
            lat: entity.lat,
            location: entity.location,
            reportTypeId: entity.reportTypeId,
            name: entity.name,
            phone: entity.phone,
            content: entity.content,
            imgId1: entity.imgId1,
            imgId2: entity.imgId2,
            sendDate: entity.sendDate,
            status: "Đang xử lý",
            adsPanelId: entity.adsPanelId
        });
    }
};
