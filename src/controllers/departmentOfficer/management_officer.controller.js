import bcrypt from "bcryptjs";
import moment from "moment";

import wardService from "../../services/departmentOfficer/ward.service.js";
import districtService from "../../services/departmentOfficer/district.service.js";
import officerService from "../../services/departmentOfficer/officer.service.js";
import accountService from "../../services/account/account.service.js";

const index = async function (req, res) {
    res.render("departmentOfficer/redirect/officer");
};

const register = async function (req, res) {
    const district = await districtService.findAll();
    res.render("departmentOfficer/management_officer/management_officer", {
        district: district
    });
};

const list_ward = async function (req, res) {
    const district = req.query.district;
    const districtId = await districtService.getIdByName(district);
    if (districtId) {
        const ward = await wardService.findAllByDistrictId(districtId.districtId);
        if (ward) {
            return res.json(ward);
        } else {
            res.json(false);
        }
    } else {
        res.json(false);
    }
};

const isAvaiable = async function (req, res) {
    console.log(req.query.username);
    const username = req.query.username;
    const account = await officerService.findByUsername(username);
    if (!account) {
        console.log("Chưa có");
        return res.json(true);
    }
    console.log("Đã có");
    res.json(false);
};

const handle_register = async function (req, res) {
    console.log(req.body);
    const username = req.body.username;
    const isExisted = await officerService.findByUsername(username);
    console.log("isExisted: ", isExisted);

    if (!isExisted) {
        const raw_password = req.body.raw_password;
        const salt = bcrypt.genSaltSync(10);
        const hash_password = bcrypt.hashSync(raw_password, salt);

        const raw_dob = req.body.raw_dob;
        const dob = moment(raw_dob, "DD/MM/YYYY").format("YYYY-MM-DD");

        const wardId = await wardService.getIdByName(req.body.ward);

        const districtId = await districtService.getIdByName(req.body.district);

        const role = req.body.role === "Phường" ? "Ward" : "District";

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
        };

        const officer = await officerService.add(account);
        console.log("officer: ", officer);
    }

    const district = await districtService.findAll();
    res.render("departmentOfficer/management_officer/management_officer", {
        district: district
    });
};

const list_officer = async function (req, res) {
    const role = req.query.role || -1;
    const page = req.query.page || 1;

    let empty = false;
    let roleName = "Tất cả cán bộ";

    let officers;
    if (role === "-1" || role === -1) {
        officers = await officerService.findAllWardOfficerAndDistrictOfficer();
    } else {
        if (role === 1 || role === "1") {
            officers = await officerService.findAllByRole("Ward");
            roleName = "Cán bộ phường";
        } else {
            officers = await officerService.findAllByRole("District");
            roleName = "Cán bộ quận";
        }
    }
    console.log(officers);

    if (!officers || officers.length === 0) {
        empty = true;
    }

    let list = officers.map((officer, index) => ({
        ...officer,
        dob: moment(officer.dob).format("DD/MM/YYYY"),
        stt: index + 1
    }));

    const currentDateTime = moment().format("HH:mm:ss DD-MM-YYYY");

    const pagination = generatePagination(list, role, page);

    res.render("departmentOfficer/management_officer/list", {
        empty: empty,
        officers: pagination.list,
        date: currentDateTime,
        isFirstPage: pagination.isFirstPage,
        isLastPage: pagination.isLastPage,
        pageNumbers: pagination.pageNumbers,
        page: page,
        role: role,
        roleName: roleName
    });
};

function generatePagination(officers, role, pageCurrent) {
    const limit = 8;
    const page = pageCurrent;
    const offset = (page - 1) * limit;

    const total = officers.length;
    const nPages = Math.ceil(total / limit);

    let pageNumbers = [];
    if (nPages <= 7) {
        for (let i = 1; i <= nPages; i++) {
            pageNumbers.push({
                value: i,
                isActive: i === +page,
                role: role
            });
        }
    } else {
        if (Number(page) + 2 <= nPages) {
            if (Number(page) > 5) {
                for (let i = 1; i <= 2; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        role: role
                    });
                }
                pageNumbers.push({
                    value: "..",
                    isActive: false,
                    role: role
                });
                for (let i = Number(page) - 2; i <= Number(page) + 2; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        role: role
                    });
                }
            } else if (Number(page) > 3) {
                for (let i = Number(page) - 3; i <= Number(page) + 3; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        role: role
                    });
                }
            } else {
                for (let i = 1; i <= 7; i++) {
                    pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        role: role
                    });
                }
            }
        } else if (Number(page) + 2 > nPages) {
            for (let i = 1; i <= 2; i++) {
                pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    role: role
                });
            }
            pageNumbers.push({
                value: "..",
                isActive: false,
                role: role
            });
            for (let i = nPages - 4; i <= nPages; i++) {
                pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    role: role
                });
            }
        }
    }

    let list = officers;
    if (total > offset) {
        list = officers.slice(offset, offset + limit);
    }

    let isFirstPage = false;
    if (Number(page) === 1) isFirstPage = true;

    let isLastPage = false;
    if (Number(page) === nPages || nPages === 0) isLastPage = true;

    const pagination = {
        list: list,
        pageNumbers: pageNumbers,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage
    };

    return pagination;
}
const arrage = async function (req, res) {
    const accountId = req.query.accountId || -1;
    if (accountId == -1) {
        res.redirect("/department-officer/management-officer/list-officer?role=-1&page=1");
    } else {
        const account = await officerService.findByIdWardDistrict(accountId);
        if (account) {
            account.dob = moment(account.dob).format("DD-MM-YYYY");
            if (account.role == "District") {
                account.role = "quận";
            }
            let ward;
            if (account.role == "Ward") {
                account.role = "phường";
                ward = account.wardId;
            }
            const district = await districtService.findAll();

            res.render("departmentOfficer/management_officer/assignment", {
                accountId: accountId,
                ward: ward,
                account: account,
                district: district
            });
        } else {
            res.redirect("/department-officer/management-officer/list-officer?role=-1&page=1");
        }
    }
};
const updateAccountRole = async function (req, res) {
    const districtname = req.query.district || null; // Tên quận
    const wardId = req.query.ward || null; // WardID
    const roleName = req.query.role || null;
    const accountId = req.query.accountId || null;
    const districtIdFull = await districtService.getIdByName(districtname);
    let role;
    if (roleName == "Cán bộ quận") {
        role = "District";
    }
    if (roleName == "Cán bộ phường") {
        role = "Ward";
    }
    await accountService.updateDistrictAndWard(accountId, districtIdFull.districtId, wardId, role);
    res.json(true);
};
export default { index, register, list_ward, isAvaiable, handle_register, list_officer, arrage, updateAccountRole };
