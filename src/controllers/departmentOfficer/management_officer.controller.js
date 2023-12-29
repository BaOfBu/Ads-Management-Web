import bcrypt from 'bcryptjs';
import moment from 'moment';

import wardService from "../../services/departmentOfficer/ward.service.js";
import districtService from "../../services/departmentOfficer/district.service.js";
import officerService from '../../services/departmentOfficer/officer.service.js';

const index = async function (req, res) {
    const empty = true;
    res.render("departmentOfficer/management_officer", {
        empty: empty
    });
};

const register = async function(req, res){
    res.render("departmentOfficer/management_officer");
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

        const wardId = wardService.getIdByName(req.body.ward);

        const districtId = districtService.getIdByName(req.body.district);

        const account = {
            username: req.body.username,
            password: hash_password,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            dob: dob,
            role: req.body.role,
            wardId: wardId,
            districtId: districtId
        }

        await officerService.add(account);
    }
    res.render("departmentOfficer/management_officer");
}
export default { index, register, isAvaiable, handle_register};
