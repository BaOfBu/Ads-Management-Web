const index = async function (req, res) {
    const empty = true;
    res.render("departmentOfficer/ads_panel", {
        empty: empty
    });
};

export default { index };
