import db from '../../utils/db.js';

export default {
    findReportByWardId(wardId) {
        return db('citizen_report as report').select(
            'report.*',
            'report_type.name as report_type_name',
        )
        .join('ads_panel', 'report.AdsPanelId', '=', 'ads_panel.adsPanelId')
        .join('ads_location', 'ads_panel.adsLocationId', '=', 'ads_location.adsLocationId')
        .join('report_type', 'report.reportTypeId', '=', 'report_type.reportTypeId')
        .where('ads_location.wardId', wardId)
    },
    findReportByReportId(reportId) {
        return db('citizen_report as report').select(
            'report.*',
            'report_type.name as report_type_name',
            'img1.imgLink as imgLink1',
            'img2.imgLink as imgLink2',
        )
        .join('ads_panel', 'report.AdsPanelId', '=', 'ads_panel.adsPanelId')
        .join('ads_location', 'ads_panel.adsLocationId', '=', 'ads_location.adsLocationId')
        .join('report_type', 'report.reportTypeId', '=', 'report_type.reportTypeId')
        .leftJoin('image as img1', 'report.imgId1', '=', 'img1.imgId')
        .leftJoin('image as img2', 'report.imgId2', '=', 'img2.imgId')
        .where('report.citizenReportId', reportId).first();
    }
}