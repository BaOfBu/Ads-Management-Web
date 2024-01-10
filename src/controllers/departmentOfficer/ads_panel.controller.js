const index = async function (req, res) {
    const empty = true;
    res.render("departmentOfficer/management_ads_panel/ads_panel", {
        empty: empty
    });
};

export default { index };
