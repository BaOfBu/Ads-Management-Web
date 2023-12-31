const index = async function (req, res) {
    const choice = req.params.choice || 'location-type';
    const empty = true;

    let title = 'loại vị trí được phép đặt bảng quảng cáo ở thành phố';
    let type = 'loại';

    switch(choice){
        case 'ads-type':{
            title = 'hình thức quảng cáo ở thành phố';
            type = 'hình thức';
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

    res.render("departmentOfficer/management_type/provided_infor", {
        title: title,
        type: type,
        empty: empty
    });
};

export default { index };
