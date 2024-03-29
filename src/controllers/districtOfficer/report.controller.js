import adsService from "../../services/wardOfficer/ads.service.js";
import reportService from "../../services/wardOfficer/report.service.js";
import moment from "moment";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ntson21@clc.fitus.edu.vn",
      pass: "Ntson2101296773776",
    },
  });

const index = async (req, res, next) => {
    const user = req.session.authUser;
    //console.log("user",user);
    const wardName = await adsService.findWardByWardId(user.wardId);
    const districtName = await adsService.findDistrictByDistrictId(user.districtId);
    const arrayReport = await reportService.findReportByWardId(user.wardId);
    for(let i = 0; i < arrayReport.length; i++){
        arrayReport[i].sendDate = moment(arrayReport[i].sendDate).format('HH:mm:ss DD-MM-YYYY');
    }
    //console.log("arrayReport",arrayReport);
    // console.log("wardName",wardName);
    // console.log("districtName",districtName);
    //console.log("arrayAdsLocation",arrayAdsLocation);
    const ReportWithIndex = arrayReport.map((report, index) => ({
        ...report,
        stt: index + 1
    }));
    //console.log("ReportWithIndex",ReportWithIndex);
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
    //console.log("report",report);
    res.render("wardOfficer/report_detail", {
        report: report
    })
}

const updateStatus = async (req, res, next) => {
    //console.log("req.body",req.body);
    const citizenReportId = req.body.txtReportId;
    const status = req.body.status;
    const report = await reportService.findReportByReportId(citizenReportId);
    console.log("report",report);
    const handlingProcedureInfor = req.body.handlingProcedureInfor;
    await reportService.updateStatus(citizenReportId, status, handlingProcedureInfor);

    const mailOptions = {
        from: "ntson21@clc.fitus.edu.vn",
        to: report.email,
        subject: "Thông báo tiến độ xử lí báo cáo",
        text: `Xin chào ${report.name}
        \nBáo cáo của bạn về việc ${report.report_type_name} tại ${report.location} ${status == "Đang xử lý" ? "đang được xử lý" : "đã được xử lý"}
        \nNội dung xử lí của cán bộ phường có nội dung như sau: ${handlingProcedureInfor}
        \nCảm ơn bạn đã gửi báo cáo về cho hệ thống\n`,
    };

    await transporter.sendMail(mailOptions);
    return res.redirect("/ward-officer/report");
    //res.redirect("/ward-officer/report/viewDetails?citizenReportId=" + citizenReportId + "");
}

export default { index, viewDetails, updateStatus };