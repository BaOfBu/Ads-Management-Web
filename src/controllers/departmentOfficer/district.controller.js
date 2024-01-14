import moment from "moment";
import districtService from "../../services/departmentOfficer/district.service.js";

const index = async function (req, res) {
    let empty = false;
    const districts = await districtService.findAll();
    if(!districts || districts.length === 0){
        empty = true;
    }

    const districtsWithIndex = districts.map((district, index) => ({
        ...district,
        stt: index + 1,
        description: district.description ? district.description.slice(0, 50) + " ..." : "",
    }));

    const currentDateTime = moment().format('HH:mm:ss DD-MM-YYYY');
    res.render("departmentOfficer/management_district/list", {
        empty: empty,
        district: districtsWithIndex,
        date: currentDateTime
    });
};

const addDistrict = async function (req, res){
    res.render("departmentOfficer/management_district/add");
}

const isAvaiable = async function(req, res){
    console.log(req.query.name);
    const name = req.query.name;
    const district = await districtService.findByName(name);
    console.log("district: ", district);
    if (!district) {
        console.log("undefined");
        return res.json(true);
    }
    res.json(false);
}

const handle_addDistrict = async function(req, res){
    console.log(req.body);
    
    const name = req.body.name;
    const isExisted = await districtService.findByName(name);
    
    if(!isExisted){
        const district = {
            name: name,
            description: req.body.description
        }

        await districtService.add(district);
    }

    res.redirect("/department-officer/district");
}

const editDistrict = async function (req, res){
    const districtId = req.query.districtId;
    const district = await districtService.findById(districtId);
    res.render("departmentOfficer/management_district/edit", {
        districtId: districtId,
        name: district.name
    });
}

const handle_deleteDistrict = async function (req, res){
    console.log("Body: ", req.body);
    await districtService.del(req.body.districtId);
    res.redirect("/department-officer/district");
}

const handle_editDistrict = async function (req, res){
    await districtService.patch(req.body);
    res.redirect("/department-officer/district");
}

const viewDetailDistrict = async function (req, res){
    const district = await districtService.findById(req.query.districtId);
    res.render("departmentOfficer/management_district/view_detail", {
        districtId: district.districtId,
        name: district.name,
        description: district.description
    })
}

export default { index , addDistrict, isAvaiable, handle_addDistrict, editDistrict, handle_deleteDistrict, handle_editDistrict, viewDetailDistrict};
