import moment from "moment";
import districtService from "../../services/departmentOfficer/district.service.js";
import wardService from "../../services/departmentOfficer/ward.service.js";
import district from "../../services/departmentOfficer/district.service.js";
import providedInfo from "../../services/departmentOfficer/provided_infor.service.js";

function generatePagination(wards, districtId, pageCurrent){
    const limit = 8;
    const page = pageCurrent;
    const offset = (page - 1) * limit;

    const total = wards.length;
    const nPages = Math.ceil(total / limit);

    let pageNumbers = [];
    if(nPages <= 7){
        for (let i = 1; i <= nPages; i++) {
            pageNumbers.push({
                value: i,
                isActive: i === +page,
                districtId: districtId,
            });
        }
    }else{
        if(Number(page) + 2 <= nPages){
            if(Number(page) > 5){
                for (let i = 1; i <= 2; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                    });
                }
                pageNumbers.push({
                    value: '..',
                    isActive: false,
                    districtId: districtId,
                });
                for (let i = Number(page) - 2; i <= Number(page) + 2; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                    });
                }  
            }else if(Number(page) > 3){
                for (let i = Number(page) - 3; i <= Number(page) + 3; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                    });
                }    
            }else{
                for (let i = 1; i <= 7; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        districtId: districtId,
                    });
                } 
            }
        }else if(Number(page) + 2 > nPages){
            for (let i = 1; i <= 2; i++) {
                pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    districtId: districtId,
                });
            }
            pageNumbers.push({
                value: '..',
                isActive: false,
                districtId: districtId,
            });
            for (let i = nPages - 4; i <= nPages; i++) {
                pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    districtId: districtId,
                });
            }
        }    
    }

    let list = wards;
    if(total > offset){
        list = wards.slice(offset, offset+limit); 
    }

    let isFirstPage = false;
    if(Number(page) === 1) isFirstPage = true;

    let isLastPage = false;
    if(Number(page) === nPages || nPages === 0) isLastPage = true;

    const pagination = {
        list: list,
        pageNumbers: pageNumbers,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage
    };

    return pagination;
}

const index = async function (req, res) {
    let empty = false;
    const districtId = req.query.districtId || -1;
    const page = req.query.page || 1;

    const districts = await district.findAll();

    let districtName = "Tất cả quận";
    if (districtId !== -1 && districtId !== "-1"){
        const tmpDistrict = await providedInfo.findById('district', 'districtId', districtId);
        districtName = "Quận " + tmpDistrict.name;
    } 

    const wards = await getListByDistrict(districtId);
    if(!wards || wards.length === 0){
        empty = true;
    }

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');

    const pagination = generatePagination(wards, districtId, page);

    res.render("departmentOfficer/management_ward/list", {
        empty: empty,
        districtName: districtName,
        districtId: districtId,
        ward: pagination.list,
        date: currentDateTime,
        isFirstPage: pagination.isFirstPage,
        isLastPage: pagination.isLastPage,
        pageNumbers: pagination.pageNumbers,
        page: page,
        districts: districts
    });
};

async function getListByDistrict(districtId){
    let wards;
    console.log("districtId: ", districtId);
    if(districtId === -1 || districtId === "-1"){
        console.log("Đã vô đây");
        wards = await wardService.findAll();   
    }else{
        wards = await wardService.findAllByDistrictId(districtId);
    }  

    let list = wards.map((ward, index) => ({
        ...ward,
        stt: index + 1,
        description: ward.description ? ward.description.slice(0, 50) + " ..." : "",
    }));

    return list;
}

const addWard = async function (req, res){
    res.render("departmentOfficer/management_ward/add", {
        districtId: req.query.districtId
    });
}

const isAvaiable = async function(req, res){
    console.log(req.query.name);
    const districtId = req.query.districtId;
    const name = req.query.name;
    const ward = await wardService.findByNameWithDistrictId(districtId, name);
    console.log("ward: ", ward);
    if (!ward) {
        console.log("undefined");
        return res.json(true);
    }
    res.json(false);
}

const handle_addWard = async function(req, res){
    console.log(req.body);

    const districtId = req.body.districtId;
    const name = req.body.name;
    const isExisted = await wardService.findByNameWithDistrictId(districtId, name);

    if(!isExisted){
        const ward = {
            name: name,
            description: req.body.description,
            districtId: districtId
        }

        await wardService.add(ward);
    }

    res.redirect("/department-officer/ward");
}

const editWard = async function (req, res){
    const districtId = req.query.districtId;
    const wardId = req.query.wardId;
    const ward = await wardService.findById(wardId);
    res.render("departmentOfficer/management_ward/edit", {
        districtId: districtId,
        wardId: wardId,
        name: ward.name
    });
}

const handle_deleteWard = async function (req, res){
    console.log("Body: ", req.body);
    await wardService.del(req.body.wardId);
    res.redirect(`/department-officer/ward?districtId=${req.body.districtId}`);
}

const handle_editWard = async function (req, res){
    console.log("Edit: ", req.body);
    await wardService.patch(req.body);
    res.redirect(`/department-officer/ward?districtId=${req.body.districtId}`);
}

const viewDetailWard = async function (req, res){
    const ward = await wardService.findById(req.query.wardId);
    res.render("departmentOfficer/management_ward/view_detail", {
        districtId: req.query.districtId,
        wardId: ward.wardId,
        name: ward.name,
        description: ward.description
    })
}

export default { index , addWard, isAvaiable, handle_addWard, editWard, handle_deleteWard, handle_editWard, viewDetailWard};
