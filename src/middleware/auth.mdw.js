const authUser = function (req, res, next) {
//console.log(req.session.authUser);
if(req.originalUrl === '/logout'){
    //console.log("logout here");
    return next();
}
if(req.session.authUser){
    switch (req.session.authUser.role) {
        case 'Ward':
            return res.redirect('/ward-officer');
        case 'District':
            return res.redirect('/district-officer');
        case 'Department':
            return res.redirect('/department-officer');
        case undefined:
            return res.redirect('/lmaoo');
    }
}

next();
};

const authLogout = function (req, res, next) {
    if (req.session.auth === false) {
        return res.redirect('/');
    }
    next();
};

const authWardOfficer = function (req, res, next) {
//console.log("authMerchant");
if(req.session.authUser){
    switch (req.session.authUser.role) {
        case 'District':
            return res.redirect('/district-officer');
        case 'Department':
            return res.redirect('/department-officer');
        case undefined:
            return res.redirect('/');
    }
}
if(req.originalUrl === '/'){
    return next();
}
if (req.session.auth === false) {
    return res.redirect('/');
}
next();
};

const authDistrictOfficer = function (req, res, next) {
    //console.log("authMerchant");
    if(req.session.authUser){
        switch (req.session.authUser.role) {
            case 'Ward':
                return res.redirect('/ward-officer');
            case 'Department':
                return res.redirect('/department-officer');
            case undefined:
                return res.redirect('/');
        }
    }
    if(req.originalUrl === '/'){
        return next();
    }
    if (req.session.auth === false) {
        return res.redirect('/');
    }
    next();
    };

const authDepartmentOfficer = function (req, res, next) {
    //console.log("authMerchant");
    if(req.session.authUser){
        switch (req.session.authUser.role) {
            case 'District':
                return res.redirect('/district-officer');
            case 'Ward':
                return res.redirect('/ward-officer');
            case undefined:
                return res.redirect('/');
        }
    }
    if(req.originalUrl === '/'){
        return next();
    }
    if (req.session.auth === false) {
        return res.redirect('/');
    }
    next();
};

const authProfile = function (req, res, next) {
    if(req.session.authUser){
        next();
    }
    if(req.originalUrl === '/'){
        return next();
    }
    if (req.session.auth === false) {
        return res.redirect('/');
    }
    next();
};


export default {
    authUser,
    authLogout,
    authWardOfficer,
    authDistrictOfficer,
    authDepartmentOfficer,
    authProfile
};
