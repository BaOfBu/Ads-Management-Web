const index = async function (req, res) {
    let empty = false;

    res.render("departmentOfficer/license_request/list", {
        empty: empty,
    });
};

export default { index };
