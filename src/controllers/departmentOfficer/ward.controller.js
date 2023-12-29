import moment from "moment";
import districtService from "../../services/departmentOfficer/district.service.js";
import wardService from "../../services/departmentOfficer/ward.service.js";

const index = async function (req, res) {
    let empty = false;
    const districtId = req.query.districtId || 1;
    const district = await districtService.findById(districtId);
    const wards = await wardService.findAllByDistrictId(districtId);
    if(!wards || wards.length === 0){
        empty = true;
    }

    const wardsWithIndex = wards.map((ward, index) => ({
        ...ward,
        stt: index + 1,
        description: ward.description ? ward.description.slice(0, 50) + " ..." : "",
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY')
    res.render("departmentOfficer/management_ward/list", {
        empty: empty,
        districtName: district.name,
        districtId: districtId,
        ward: wardsWithIndex,
        date: currentDateTime
    });
};

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
