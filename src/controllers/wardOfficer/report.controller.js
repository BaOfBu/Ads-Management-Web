import adsService from "../../services/wardOfficer/ads.service.js";
import reportService from "../../services/wardOfficer/report.service.js";
import moment from "moment";

const index = async (req, res, next) => {
    const user = req.session.authUser;
    //console.log("user",user);
    const wardName = await adsService.findWardByWardId(user.wardId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayReport = await reportService.findReportByWardId(user.wardId);
    //console.log("arrayReport",arrayReport);
    // console.log("wardName",wardName);
    // console.log("districtName",districtName);
    //console.log("arrayAdsLocation",arrayAdsLocation);
    const ReportWithIndex = arrayReport.map((report, index) => ({
        ...report,
        stt: index + 1
    }));
    console.log("ReportWithIndex",ReportWithIndex);
    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY')
    res.render("wardOfficer/report", {
        wardName: wardName.name,
        districtName: districtName.name,
        arrayReport: ReportWithIndex,
        date: currentDateTime,
        isEmpty: ReportWithIndex.length == 0
    });
}

const viewDetails = async (req, res, next) => {
    const report = await reportService.findReportByReportId(req.query.citizenReportId);
    console.log("report",report);
    res.render("wardOfficer/report_detail", {
        report: report
    })
}

export default { index, viewDetails };