const index = async function (req, res) {
    const page = req.query.page || 'register';
    const empty = true;
    switch(page){
        case 'register':{
            res.render("departmentOfficer/management_officer", {
                empty: empty
            });
            break;
        }
    }
};

export default { index };
