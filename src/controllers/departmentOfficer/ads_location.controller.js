const index = async function (req, res) {
    const empty = true;
    res.render("departmentOfficer/management_ads_location/ads_location", {
        empty: empty
    });
};

export default { index };
