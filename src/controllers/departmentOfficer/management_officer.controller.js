import bcrypt from 'bcryptjs';
import moment from 'moment';

import wardService from "../../services/departmentOfficer/ward.service.js";
import districtService from "../../services/departmentOfficer/district.service.js";
import officerService from '../../services/departmentOfficer/officer.service.js';

const index = async function (req, res) {
    const district = districtService.findAll();
    res.render("departmentOfficer/management_officer", {
        district: district
    });
};

const register = async function(req, res){
    const district = await districtService.findAll();
    res.render("departmentOfficer/management_officer", {
        district: district,
    });
}

const list_ward = async function(req, res){
    const district = req.query.district;
    const districtId = await districtService.getIdByName(district);
    if(districtId){
        const ward = await wardService.findAllByDistrictId(districtId.districtId);
        if(ward){
            return res.json(ward);
        }else{
            res.json(false);
        }
    }else{
        res.json(false);
    }
}

const isAvaiable = async function(req, res){
    console.log(req.query.username);
    const username = req.query.username;
    const account = await officerService.findByUsername(username);
    if (!account) {
        return res.json(true);
    }
    res.json(false);
}

const handle_register = async function(req, res){
    console.log(req.body);
    const username = req.body.username;
    const isExisted = await officerService.findByUsername(username);
    if(!isExisted){
        const raw_password = req.body.raw_password;
        const salt = bcrypt.genSaltSync(10);
        const hash_password = bcrypt.hashSync(raw_password, salt);

        const raw_dob = req.body.raw_dob;
        const dob = moment(raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

        const wardId = await wardService.getIdByName(req.body.ward);

        const districtId = await districtService.getIdByName(req.body.district);

        const account = {
            username: req.body.username,
            password: hash_password,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            dob: dob,
            role: req.body.role,
            wardId: wardId.wardId,
            districtId: districtId.districtId
        }

        await officerService.add(account);
    }
    const district = districtService.findAll();
    res.render("departmentOfficer/management_officer", {
        district: district
    });
}
export default { index, register, list_ward, isAvaiable, handle_register};
