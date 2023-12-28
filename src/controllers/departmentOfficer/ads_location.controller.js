const index = async function (req, res) {
    const empty = true;
    res.render("departmentOfficer/ads_location", {
        empty: empty
    });
};

export default { index };
