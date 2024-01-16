import citizenReport from "../../services/departmentOfficer/citizen_report.service.js";
import district from "../../services/departmentOfficer/district.service.js";
import moment from "moment";

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



export default { index };
