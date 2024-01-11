import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";

const index = async function (req, res) {
    const choice = req.params.choice || 'location-type';
    let empty = false;

    let title = 'loại vị trí được phép đặt bảng quảng cáo ở thành phố';
    let type = 'loại';

    let information;
    switch(choice){
        case 'location-type':{
            title = 'loại vị trí';
            information = await providedInfo.findAll('location_type');
            break;
        };
        case 'ads-type':{
            title = 'hình thức quảng cáo ở thành phố';
            type = 'hình thức';
            information = await providedInfo.findAll('ads_type');
            break;
        };
        case 'ads-panel-type':{
            title = 'loại bảng quảng cáo ở thành phố';
            information = await providedInfo.findAll('ads_panel_type');
            break;
        };
        case 'report-type':{
            title = 'hình thức báo cáo liên quan đến một bảng quảng cáo, hoặc một địa điểm trên bản đồ';
            type = 'hình thức';
        }
    }

    console.log("Info: ", information);
    if(!information || information.length === 0){
        empty = true;
    }

    let informationsWithIndex = [];
    if(!empty){
        informationsWithIndex = information.map((info, index) => ({
            ...info,
            choice: choice,
            stt: index + 1,
            description: info.description ? info.description.slice(0, 50) + " ..." : "",
        }));
    }

    res.render("departmentOfficer/management_type/provided_infor", {
        choice: choice,
        title: title,
        type: type,
        information: informationsWithIndex,
        empty: empty
    });
};

const viewDetailProvidedInfo = async function (req, res){
    const choice = req.params.choice || 'location-type';
    const empty = false;
    let id;
    let typeName = 'loại';

    let information;
    switch(choice){
        case 'location-type':{
            id = req.query.locationType;
            information = await providedInfo.findById('location_type', 'locationTypeId', id);
            break;
        };
        case 'ads-type':{
            typeName = 'hình thức';
            id = req.query.adsType;
            information = await providedInfo.findById('ads_type', 'adsTypeId', id);
            break;
        };
        case 'ads-panel-type':{
            id = req.query.adsPanelType;
            information = await providedInfo.findById('ads_panel_type', 'adsPanelTypeId', id);
            break;
        };
        case 'report-type':{
            id = req.query.reportType;
            information = await providedInfo.findById('report_type', 'reportTypeId', id);
            typeName = 'hình thức';
        }
    }

    // res.render("departmentOfficer/management_type/provided_infor", {
    //     choice: choice,
    //     title: title,
    //     type: type,
    //     information: informationsWithIndex,
    //     empty: empty
    // });

    res.render("departmentOfficer/management_type/view_detail", {
        id: id,
        choice: choice,
        stt: req.query.stt,
        type: information,
        typeName: typeName
    });
}

export default { index, viewDetailProvidedInfo };
