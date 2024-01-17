import citizenReport from "../../services/departmentOfficer/citizen_report.service.js";
import district from "../../services/departmentOfficer/district.service.js";
import ward from "../../services/departmentOfficer/ward.service.js";
import moment from "moment";
import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";

const index = async function (req, res) {
    let empty = false;
    
    const citizen_report = await citizenReport.findAll();
    console.log("citizen-report: ", citizen_report);
    const districts = await district.findAll();

    if(!citizen_report || citizen_report.length === 0){
        empty = true;
    }

    let citizen_reportWithIndex = citizen_report.map((report, index) => ({
        ...report,
        object: (report.adsPanelId === null)? 'Địa điểm' : 'Bảng quảng cáo', 
        sendDate: moment(report.sendDate).format('DD/MM/YYYY'),
        stt: index + 1,
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/citizen_report/citizen_report", {
        empty: empty,
        citizen_report: citizen_reportWithIndex,
        date: currentDateTime,
        districts: districts
    });
};

const getWardByDistrict = async function(req, res){
    const wards = await ward.findAllByDistrictId(req.body.districtId);
    console.log("wards: ", wards);
    return res.json({success: true, wards: wards});
}

const getReportByWard = async function(req, res){
    let reports;
    console.log("districtId: ", req.body.districtId);
    if(req.body.wardId === -1){
        if(req.body.districtId === -1 || req.body.districtId === "-1"){
            console.log("Đã vô đây");
            reports = await citizenReport.findAll();   
        }else{
            reports = await citizenReport.findAllByDistrict(req.body.districtId);
        }  
    }else{
        reports = await citizenReport.findAllByWard(req.body.wardId);
    }

    let report = reports.map((report, index) => ({
        ...report,
        object: (report.adsPanelId === null)? 'Địa điểm' : 'Bảng quảng cáo', 
        sendDate: moment(report.sendDate).format('DD/MM/YYYY'),
        stt: index + 1,
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');
    console.log("report: ", report);

    let totalProcessing = 0;
    let totalProcessed = 0;
    let totalReportType = {};
    let totalPoint = 0;
    let totalPanel = 0;

    let reportType = await providedInfo.findAll('report_type');
    for(let i = 0; i < reportType.length; i++){
        totalReportType[reportType[i].name] = 0;
    }

    for(let i = 0; i < report.length; i++){
        if(report[i].status === 'Đang xử lý') {
            totalProcessing++;
        }else if(report[i].status === 'Đã xử lý xong'){
            totalProcessed++;
        }

        totalReportType[report[i].report_type_name] = totalReportType[report[i].report_type_name] + 1;
        
        if(report[i].adsPanelId === null){
            totalPoint++;
        }else{
            totalPanel++;
        }
    }

    console.log(totalReportType);

    return res.json({success: true, report: report, date: currentDateTime, totalReport: report.length, totalProcessing: totalProcessing, 
        totalProcessed: totalProcessed, totalReportType: totalReportType, totalPoint: totalPoint, totalPanel: totalPanel});   
}

export default { index, getWardByDistrict, getReportByWard };
