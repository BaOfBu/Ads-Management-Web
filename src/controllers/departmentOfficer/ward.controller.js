const index = async function (req, res) {
    const districtId = req.params.districtId || 1;
    const empty = true;
    res.render("departmentOfficer/ward", {
        empty: empty
    });
};

export default { index };
