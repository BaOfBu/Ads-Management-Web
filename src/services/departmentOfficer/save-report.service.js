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
            status: "Chưa xử lý",
            adsPanelId: null,
            wardId: entity.wardId,
            districtId: entity.districtId
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
            districtId: entity.districtId,
            wardId: entity.wardId,
            status: "Chưa xử lý",
            adsPanelId: entity.adsPanelId
        });
    },
    async checkReportAdsPanel(entity) {
        const result = await db("citizen_report").where("adsPanelId", "=", entity).first();
        return result != undefined;
    }
};
