const index = async function (req, res) {
    let empty = false;

    res.render("wardOfficer/license_request", {
        empty: empty,
    });
};

export default { index };
