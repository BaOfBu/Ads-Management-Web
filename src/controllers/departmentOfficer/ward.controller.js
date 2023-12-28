const index = async function (req, res) {
    const empty = true;
    res.render("departmentOfficer/ward", {
        empty: empty
    });
};

export default { index };
