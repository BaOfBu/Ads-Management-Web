const index = async function (req, res) {
    let empty = false;

    res.render("departmentOfficer/ads_location_modification_request/list", {
        empty: empty,
    });
};

export default { index };