import moment from 'moment';

import wardService from "../../services/departmentOfficer/ward.service.js";
import districtService from "../../services/departmentOfficer/district.service.js";
import officerService from '../../services/departmentOfficer/officer.service.js';

const update = async function(req, res){
    const user = req.session.authUser;
    console.log("Đã vô update: ", user);
    let officer = await officerService.findById(user.accountId);
    console.log("officer: ", officer);
    const district = await districtService.findAll();
    officer.dob = moment(officer.dob).format('DD/MM/YYYY');
    res.render("wardOfficer/profile", {
        district: district,
        officer: officer
    });
}

const handle_update = async function(req, res){
    console.log(req.body);

    let officer;
    const raw_dob = req.body.raw_dob;
    const dob = moment(raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const user = req.session.authUser;

    console.log('user: ', user);

    const account = {
        accountId: user.accountId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        dob: dob,
    }

    officer = await officerService.patch(account);
    console.log("officer: ", officer);

    const district = await districtService.findAll();
    res.redirect("/ward-officer/profile");

}

export default { update, handle_update };
