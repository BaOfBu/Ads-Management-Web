import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";
import moment from "moment";

const index = async function (req, res) {
    const choice = req.params.choice || 'location-type';
    let empty = false;

    let title = 'loại vị trí được phép đặt bảng quảng cáo ở thành phố';
    let type = 'loại';

    let providedInfos = [{choice: 'location-type', name: 'Loại vị trí'}, {choice: 'ads-type', name: 'Hình thức quảng cáo'}, {
        choice: 'ads-panel-type', name: 'Loại bảng quảng cáo'}, {choice: 'report-type', name: 'Hình thức báo cáo'}];
    let infoCurrent = 'Loại vị trí';

    let information;
    switch(choice){
        case 'location-type':{
            title = 'loại vị trí';
            information = await providedInfo.findAll('location_type');
            break;
        };
        case 'ads-type':{
            infoCurrent = 'Hình thức quảng cáo';
            title = 'hình thức quảng cáo ở thành phố';
            type = 'hình thức';
            information = await providedInfo.findAll('ads_type');
            break;
        };
        case 'ads-panel-type':{
            infoCurrent = 'Loại bảng quảng cáo';
            title = 'loại bảng quảng cáo ở thành phố';
            information = await providedInfo.findAll('ads_panel_type');
            break;
        };
        case 'report-type':{
            infoCurrent = 'Hình thức báo cáo';
            title = 'hình thức báo cáo liên quan đến một bảng quảng cáo, hoặc một địa điểm trên bản đồ';
            type = 'hình thức';
            information = await providedInfo.findAll('report_type');
            break;
        }
    }

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

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    res.render("departmentOfficer/management_type/provided_infor", {
        choice: choice,
        title: title,
        type: type,
        information: informationsWithIndex,
        empty: empty,
        date: currentDateTime,
        infoCurrent: infoCurrent,
        providedInfo: providedInfos
    });
};

const viewDetailProvidedInfo = async function (req, res){
    const choice = req.params.choice || 'location-type';
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

    res.render("departmentOfficer/management_type/view_detail", {
        id: id,
        choice: choice,
        stt: req.query.stt,
        type: information,
        typeName: typeName
    });
}

const addType = async function (req, res){
    let choice = req.params.choice;
    let typeName = 'loại vị trí';
    if(choice === 'ads-type'){
        typeName = 'hình thức quảng cáo';
    }else if(choice === 'ads-panel-type'){
        typeName = 'loại bảng quảng cáo';
    }else if(choice === 'report-type'){
        typeName = 'hình thức báo cáo';
    }

    res.render("departmentOfficer/management_type/add", {
        choice: choice,
        typeName: typeName
    });
}

const isAvailable = async function(req, res){
    let choice = req.params.choice;
    const name = req.query.name;
    let database = choice.replace('-', '_');

    let id = await providedInfo.findByName(database, name);
    console.log("id: ", id);
    if (!id) {
        console.log("undefined");
        return res.json(true);
    }else{
        if(id.name === name) return res.json(true);
    }
    res.json(false);
}

const handle_addType = async function(req, res){
    let choice = req.body.choice;
    const name = req.body.name;
    let database = choice.replace('-', '_');

    const isExisted = await providedInfo.findByName(database, name);

    if(!isExisted){
        const type = {
            name: name,
            description: req.body.description,
        }

        await providedInfo.add(database, type);
    }

    res.redirect(`/department-officer/provided-info/${choice}`);
}

const editType = async function (req, res){
    let choice = req.params.choice;
    const id = req.query.id;
    const stt = req.query.stt;

    let database = choice.replace('-', '_');
    let field = 'locationTypeId';
    if(choice === 'ads-type'){
        field = 'adsTypeId';
    }else if(choice === 'ads-panel-type'){
        field = 'adsPanelTypeId';
    }else if(choice === 'report-type'){
        field = 'reportTypeId';
    }

    const type = await providedInfo.findById(database, field, id);

    let typeName = 'loại vị trí';
    if(choice === 'ads-type'){
        typeName = 'hình thức quảng cáo';
    }else if(choice === 'ads-panel-type'){
        typeName = 'loại bảng quảng cáo';
    }else if(choice === 'report-type'){
        typeName = 'hình thức báo cáo';
    }

    res.render("departmentOfficer/management_type/edit", {
        choice: choice,
        type: type,
        id: id,
        stt: stt,
        typeName: typeName
    });
}

const handle_deleteType = async function (req, res){
    const choice = req.body.choice;
    let database = choice.replace('-', '_');
    let field = 'locationTypeId';
    if(choice === 'ads-type'){
        field = 'adsTypeId';
    }else if(choice === 'ads-panel-type'){
        field = 'adsPanelTypeId';
    }else if(choice === 'report-type'){
        field = 'reportTypeId';
    }

    await providedInfo.del(database, field, req.body.id);
    res.redirect(`/department-officer/provided-info/${choice}`);
}

const handle_editType = async function (req, res){
    const choice = req.body.choice;
    let database = choice.replace('-', '_');
    let field = 'locationTypeId';
    if(choice === 'ads-type'){
        field = 'adsTypeId';
    }else if(choice === 'ads-panel-type'){
        field = 'adsPanelTypeId';
    }else if(choice === 'report-type'){
        field = 'reportTypeId';
    }

    await providedInfo.patch(database, field, req.body.id, req.body);
    res.redirect(`/department-officer/provided-info/${choice}`);
}
export default { index, viewDetailProvidedInfo, addType, isAvailable, handle_addType, editType, handle_deleteType, handle_editType };
