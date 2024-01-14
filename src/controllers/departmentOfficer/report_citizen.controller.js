const index = async function (req, res) {
    let empty = false;
    
    res.render("departmentOfficer/report_citizen/report_citizen", {
        empty: empty,
    });
};



export default { index };
