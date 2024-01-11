import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";

const index = async function (req, res) {
    const choice = req.params.choice || 'location-type';
    const empty = false;

    let title = 'loại vị trí được phép đặt bảng quảng cáo ở thành phố';
    let type = 'loại';

    let information;
    switch(choice){
        case 'ads-type':{
            title = 'hình thức quảng cáo ở thành phố';
            type = 'hình thức';
            information = await providedInfo.findAll('ads_type');
            break;
        };
        case 'ads-panel-type':{
            title = 'loại bảng quảng cáo ở thành phố';
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


    const informationsWithIndex = information.map((info, index) => ({
        ...info,
        stt: index + 1,
        description: info.description ? info.description.slice(0, 50) + " ..." : "",
    }));

    res.render("departmentOfficer/management_type/provided_infor", {
        title: title,
        type: type,
        information: informationsWithIndex,
        empty: empty
    });
};

export default { index };
