const index = async function (req, res) {
    const empty = true;
    res.render("departmentOfficer/home", {
        empty: empty
    });
};

export default { index };
